import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { useTestDatabase } from "./helpers/db.js";
import { createUser, loginAgent } from "./helpers/factory.js";

useTestDatabase();
const app = createApp();

describe("uygulama", () => {
  it("health endpoint'i veritabanı durumunu döner", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok", database: "up" });
  });

  it("her yanıta request id ekler ve gelen id'yi korur", async () => {
    const generated = await request(app).get("/health");
    expect(generated.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);

    const forwarded = await request(app).get("/health").set("X-Request-Id", "istek-12345678");
    expect(forwarded.headers["x-request-id"]).toBe("istek-12345678");
  });

  it("güvenlik başlıklarını ekler", async () => {
    const response = await request(app).get("/health");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers).not.toHaveProperty("x-powered-by");
  });

  it("izinli origin için CORS başlığı döner, diğerleri için dönmez", async () => {
    const allowed = await request(app).get("/api/categories").set("Origin", "http://localhost:3000");
    expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(allowed.headers["access-control-allow-credentials"]).toBe("true");

    const denied = await request(app).get("/api/categories").set("Origin", "https://kotu.example.com");
    expect(denied.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("tutarlı 404 formatı döner", async () => {
    const response = await request(app).get("/api/olmayan");
    expect(response.status).toBe(404);
    expect(response.body.error).toMatchObject({ code: "NOT_FOUND" });
  });

  it("büyük gövdeyi reddeder", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@example.com", password: "x".repeat(200 * 1024) });
    expect(response.status).toBe(413);
  });

  it("NoSQL operatör enjeksiyonunu engeller", async () => {
    const user = await createUser();
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: { $gt: "" }, password: { $gt: "" } });
    expect(response.status).toBe(400);
    expect(JSON.stringify(response.body)).not.toContain(user.email);
  });

  it("OpenAPI dokümanını sunar", async () => {
    const response = await request(app).get("/api/openapi.json");
    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty("/api/requests");
  });

  it("yetkisiz kullanıcıya kategori oluşturma izni vermez", async () => {
    const agent = await loginAgent(app, await createUser());
    expect((await agent.post("/api/categories").send({ name: "Deneme" })).status).toBe(403);
  });
});
