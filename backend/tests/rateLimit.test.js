import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { useTestDatabase } from "./helpers/db.js";

useTestDatabase();

describe("auth rate limit", () => {
  it("limit aşıldığında 429 döner", async () => {
    vi.resetModules();
    process.env.AUTH_RATE_LIMIT_MAX = "3";
    const { createApp } = await import("../app.js");
    const app = createApp();
    const attempt = () => request(app).post("/api/auth/login").send({ email: "a@example.com", password: "Parola123" });

    for (let i = 0; i < 3; i += 1) {
      expect((await attempt()).status).toBe(401);
    }
    const blocked = await attempt();
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe("TOO_MANY_REQUESTS");
  });
});
