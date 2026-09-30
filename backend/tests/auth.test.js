import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { RefreshToken, User } from "../models/index.js";
import { useTestDatabase } from "./helpers/db.js";
import { DEFAULT_PASSWORD, cookieNames, createUser, findCookie, loginAgent } from "./helpers/factory.js";

useTestDatabase();
const app = createApp();

function refreshCookieValue(response) {
  return findCookie(response, "refresh_token").split(";")[0].split("=")[1];
}

describe("POST /api/auth/register", () => {
  it("kullanıcıyı oluşturur ve parola hash'ini döndürmez", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "Zeynep",
      lastName: "Kaya",
      email: "Zeynep@Example.com ",
      password: "GucluParola1",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("zeynep@example.com");
    expect(JSON.stringify(response.body)).not.toMatch(/password|parola|\$2b\$/i);
  });

  it("aynı e-posta ile ikinci kaydı reddeder", async () => {
    await createUser({ email: "tekrar@example.com" });
    const response = await request(app).post("/api/auth/register").send({
      firstName: "A",
      lastName: "B",
      email: "TEKRAR@example.com",
      password: "GucluParola1",
    });

    expect(response.status).toBe(409);
  });

  it("zayıf parolayı reddeder", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "A",
      lastName: "B",
      email: "zayif@example.com",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("POST /api/auth/login", () => {
  it("httpOnly çerezleri ayarlar ve gövdede token döndürmez", async () => {
    const user = await createUser();
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: DEFAULT_PASSWORD });

    expect(response.status).toBe(200);
    expect(cookieNames(response)).toEqual(expect.arrayContaining(["access_token", "refresh_token"]));
    expect(findCookie(response, "access_token")).toMatch(/HttpOnly/);
    expect(findCookie(response, "refresh_token")).toMatch(/SameSite=Lax/);
    expect(response.body.data).not.toHaveProperty("token");
    expect(JSON.stringify(response.body)).not.toContain(user.passwordHash);
  });

  it("bilinmeyen e-posta ve yanlış parola için aynı hatayı döner", async () => {
    const user = await createUser();
    const unknown = await request(app)
      .post("/api/auth/login")
      .send({ email: "yok@example.com", password: DEFAULT_PASSWORD });
    const wrong = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "YanlisParola1" });

    expect(unknown.status).toBe(401);
    expect(wrong.status).toBe(401);
    expect(unknown.body.error.message).toBe(wrong.body.error.message);
  });

  it("dondurulmuş hesabı girişte yeniden aktifleştirir", async () => {
    const user = await createUser({ isActive: false });
    await loginAgent(app, user);
    expect((await User.findById(user._id)).isActive).toBe(true);
  });
});

describe("korumalı rotalar", () => {
  it("çerez olmadan 401 döner", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
  });

  it("eski sabit secret ile imzalanmış sahte token'ı reddeder", async () => {
    const user = await createUser({ role: "admin" });
    const forged = jwt.sign({ id: user._id, role: "admin" }, "secretkey123", {
      subject: user._id.toString(),
      issuer: "hizmet-kap",
      audience: "hizmet-kap-app",
    });

    const response = await request(app).get("/api/users").set("Cookie", `access_token=${forged}`);
    expect(response.status).toBe(401);
  });

  it("imzasız (alg none) token'ı reddeder", async () => {
    const user = await createUser();
    const unsigned = jwt.sign({ role: "admin" }, null, {
      algorithm: "none",
      subject: user._id.toString(),
    });

    const response = await request(app).get("/api/users/me").set("Cookie", `access_token=${unsigned}`);
    expect(response.status).toBe(401);
  });

  it("geçerli oturumla kullanıcıyı döner", async () => {
    const user = await createUser();
    const agent = await loginAgent(app, user);
    const response = await agent.get("/api/users/me");

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(user._id.toString());
    expect(response.body.data).not.toHaveProperty("passwordHash");
  });
});

describe("POST /api/auth/refresh", () => {
  it("refresh token'ı döndürür (rotation) ve eskisini geçersiz kılar", async () => {
    const user = await createUser();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: DEFAULT_PASSWORD });
    const firstRefresh = refreshCookieValue(login);

    const rotated = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", `refresh_token=${firstRefresh}`);

    expect(rotated.status).toBe(200);
    const secondRefresh = refreshCookieValue(rotated);
    expect(secondRefresh).not.toBe(firstRefresh);
    expect(findCookie(rotated, "access_token")).toBeDefined();
  });

  it("kullanılmış token tekrar gelirse tüm aileyi iptal eder (reuse detection)", async () => {
    const user = await createUser();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: DEFAULT_PASSWORD });
    const stolen = refreshCookieValue(login);

    const legit = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${stolen}`);
    const latest = refreshCookieValue(legit);

    const reuse = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${stolen}`);
    expect(reuse.status).toBe(401);
    expect(reuse.body.error.code).toBe("REFRESH_REUSED");

    const afterReuse = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${latest}`);
    expect(afterReuse.status).toBe(401);

    const active = await RefreshToken.countDocuments({ user: user._id, revokedAt: null });
    expect(active).toBe(0);
  });

  it("refresh token'ı veritabanında hash'lenmiş saklar", async () => {
    const user = await createUser();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: DEFAULT_PASSWORD });
    const raw = refreshCookieValue(login);

    expect(await RefreshToken.exists({ tokenHash: raw })).toBeNull();
    expect(await RefreshToken.countDocuments({ user: user._id })).toBe(1);
  });
});

describe("POST /api/auth/logout", () => {
  it("oturumu iptal eder ve çerezleri temizler", async () => {
    const user = await createUser();
    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: DEFAULT_PASSWORD });
    const refresh = refreshCookieValue(login);

    const logout = await request(app).post("/api/auth/logout").set("Cookie", `refresh_token=${refresh}`);
    expect(logout.status).toBe(204);
    expect(findCookie(logout, "access_token")).toMatch(/Expires=Thu, 01 Jan 1970/);

    const reuse = await request(app).post("/api/auth/refresh").set("Cookie", `refresh_token=${refresh}`);
    expect(reuse.status).toBe(401);
  });
});
