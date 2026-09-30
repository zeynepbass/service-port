import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { useTestDatabase } from "./helpers/db.js";
import { createCategoryWithTemplate, createUser, loginAgent } from "./helpers/factory.js";

useTestDatabase();
const app = createApp();

describe("kategoriler", () => {
  it("listeyi oturumsuz döner", async () => {
    await createCategoryWithTemplate();
    const response = await request(app).get("/api/categories");
    expect(response.status).toBe(200);
    expect(response.body.data[0]).toHaveProperty("slug");
  });

  it("slug veya id ile kategori getirir", async () => {
    const { category } = await createCategoryWithTemplate();
    expect((await request(app).get(`/api/categories/${category.slug}`)).body.data.id).toBe(category.id);
    expect((await request(app).get(`/api/categories/${category.id}`)).body.data.slug).toBe(category.slug);
    expect((await request(app).get("/api/categories/olmayan")).status).toBe(404);
  });

  it("kategori oluşturmayı yalnızca admine açar", async () => {
    const userAgent = await loginAgent(app, await createUser());
    const adminAgent = await loginAgent(app, await createUser({ role: "admin" }));
    const payload = { name: "Çatı Tamiri", description: "Çatı işleri" };

    expect((await request(app).post("/api/categories").send(payload)).status).toBe(401);
    expect((await userAgent.post("/api/categories").send(payload)).status).toBe(403);

    const created = await adminAgent.post("/api/categories").send(payload);
    expect(created.status).toBe(201);
    expect(created.body.data.slug).toBe("cati-tamiri");
    expect((await adminAgent.post("/api/categories").send(payload)).status).toBe(409);
  });

  it("şablon düzenlemeyi yalnızca admine açar", async () => {
    const { category } = await createCategoryWithTemplate();
    const steps = [{ question: "Kaç metrekare?", options: ["50", "100"] }];
    const userAgent = await loginAgent(app, await createUser());
    const adminAgent = await loginAgent(app, await createUser({ role: "admin" }));

    expect((await userAgent.put(`/api/categories/${category.slug}/template`).send({ steps })).status).toBe(403);

    const saved = await adminAgent.put(`/api/categories/${category.slug}/template`).send({ steps });
    expect(saved.status).toBe(200);

    const fetched = await userAgent.get(`/api/categories/${category.slug}/template`);
    expect(fetched.body.data.steps).toEqual(steps);
  });

  it("talebi olan kategorinin silinmesini engeller", async () => {
    const { category } = await createCategoryWithTemplate();
    const owner = await createUser();
    const ownerAgent = await loginAgent(app, owner);
    await ownerAgent.post("/api/requests").send({
      categoryId: category.id,
      answers: [
        { question: "Kaç oda boyanacak?", selected: "2" },
        { question: "Tavan da boyanacak mı?", selected: "Evet" },
      ],
    });
    const adminAgent = await loginAgent(app, await createUser({ role: "admin" }));

    expect((await adminAgent.delete(`/api/categories/${category.slug}`)).status).toBe(409);
  });
});
