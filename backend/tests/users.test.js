import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { uploadDirectory } from "../middleware/upload.js";
import { ServiceRequest, User } from "../models/index.js";
import { useTestDatabase } from "./helpers/db.js";
import { DEFAULT_PASSWORD, createCategoryWithTemplate, createUser, loginAgent } from "./helpers/factory.js";

useTestDatabase();
const app = createApp();

const PNG = Buffer.from(
  "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a4c40000000049454e44ae426082",
  "hex",
);

describe("PATCH /api/users/me", () => {
  it("izinli alanları günceller", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);

    const response = await agent
      .patch("/api/users/me")
      .field("firstName", "Mehmet")
      .field("phone", "+90 555 111 22 33");

    expect(response.status).toBe(200);
    expect(response.body.data.firstName).toBe("Mehmet");
    expect(response.body.data.phone).toBe("+90 555 111 22 33");
  });

  it("rol veya aktiflik gibi izinsiz alanları reddeder", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);

    const response = await agent.patch("/api/users/me").field("role", "admin").field("isActive", "false");

    expect(response.status).toBe(400);
    expect((await User.findById(user._id)).role).toBe("user");
  });

  it("başka bir kullanıcının e-postasını almaya izin vermez", async () => {
    const other = await createUser();
    const user = await createUser();
    const agent = await loginAgent(app, user);

    const response = await agent.patch("/api/users/me").field("email", other.email);
    expect(response.status).toBe(409);
  });

  it("geçerli görseli rastgele isimle kaydeder ve eskisini siler", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);

    const first = await agent
      .patch("/api/users/me")
      .attach("avatar", PNG, { filename: "../../evil.png", contentType: "image/png" });
    expect(first.status).toBe(200);
    const firstFile = path.basename(first.body.data.avatar);
    expect(firstFile).toMatch(/^[0-9a-f-]{36}\.png$/);
    expect(fs.existsSync(path.join(uploadDirectory, firstFile))).toBe(true);

    const second = await agent
      .patch("/api/users/me")
      .attach("avatar", PNG, { filename: "yeni.png", contentType: "image/png" });
    expect(second.status).toBe(200);
    expect(fs.existsSync(path.join(uploadDirectory, firstFile))).toBe(false);
  });

  it("izin verilmeyen MIME türünü reddeder", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);

    const response = await agent
      .patch("/api/users/me")
      .attach("avatar", Buffer.from("<svg></svg>"), { filename: "x.svg", contentType: "image/svg+xml" });
    expect(response.status).toBe(400);
  });

  it("içeriği görsel olmayan dosyayı reddeder ve diskten siler", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);
    const before = fs.readdirSync(uploadDirectory).length;

    const response = await agent
      .patch("/api/users/me")
      .attach("avatar", Buffer.from("not really a png file"), {
        filename: "x.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(400);
    expect(fs.readdirSync(uploadDirectory).length).toBe(before);
  });

  it("5 MB'tan büyük dosyayı reddeder", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);
    const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024)]);

    const response = await agent
      .patch("/api/users/me")
      .attach("avatar", big, { filename: "big.png", contentType: "image/png" });
    expect(response.status).toBe(400);
  });
});

describe("GET /api/users/:id", () => {
  it("yalnızca herkese açık alanları döner", async () => {
    const target = await createUser({ phone: "+905551112233" });
    const viewer = await createUser();
    const agent = await loginAgent(app, viewer);

    const response = await agent.get(`/api/users/${target._id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).not.toHaveProperty("email");
    expect(response.body.data).not.toHaveProperty("phone");
    expect(response.body.data).not.toHaveProperty("passwordHash");
  });
});

describe("GET /api/users", () => {
  it("admin olmayanlara kapalıdır", async () => {
    const agent = await loginAgent(app, await createUser());
    expect((await agent.get("/api/users")).status).toBe(403);
  });

  it("admin için sayfalı liste döner", async () => {
    const admin = await createUser({ role: "admin" });
    await Promise.all([createUser(), createUser(), createUser()]);
    const agent = await loginAgent(app, admin);

    const firstPage = await agent.get("/api/users?limit=2");
    expect(firstPage.status).toBe(200);
    expect(firstPage.body.data).toHaveLength(2);
    expect(firstPage.body.meta.hasMore).toBe(true);

    const secondPage = await agent.get(`/api/users?limit=2&cursor=${firstPage.body.meta.nextCursor}`);
    expect(secondPage.body.data).toHaveLength(2);
    expect(secondPage.body.meta.hasMore).toBe(false);
    expect(JSON.stringify(secondPage.body)).not.toContain("passwordHash");
  });
});

describe("hesap dondurma ve silme", () => {
  it("dondurulan hesap oturumu kapatır", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);

    expect((await agent.post("/api/users/me/deactivate")).status).toBe(204);
    expect((await User.findById(user._id)).isActive).toBe(false);
    expect((await agent.post("/api/auth/refresh")).status).toBe(401);
  });

  it("silme işlemi parola ister ve kullanıcının taleplerini kaldırır", async () => {
    const user = await createUser();
    const { category } = await createCategoryWithTemplate();
    await ServiceRequest.create({
      owner: user._id,
      category: category._id,
      title: category.name,
      answers: [{ question: "Soru", options: ["A"], selected: "A" }],
    });
    const agent = await loginAgent(app, user);

    expect((await agent.delete("/api/users/me").send({ password: "YanlisParola1" })).status).toBe(401);
    expect((await agent.delete("/api/users/me").send({ password: DEFAULT_PASSWORD })).status).toBe(204);
    expect(await User.exists({ _id: user._id })).toBeNull();
    expect(await ServiceRequest.countDocuments({ owner: user._id })).toBe(0);
  });
});
