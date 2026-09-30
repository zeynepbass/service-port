import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { PasswordResetToken, RefreshToken } from "../models/index.js";
import { sendPasswordResetMail } from "../services/mail.service.js";
import { useTestDatabase } from "./helpers/db.js";
import { createUser, loginAgent } from "./helpers/factory.js";

vi.mock("../services/mail.service.js", () => ({ sendPasswordResetMail: vi.fn() }));

useTestDatabase();
const app = createApp();

function tokenFromMail() {
  const { resetUrl } = sendPasswordResetMail.mock.calls.at(-1)[0];
  return new URL(resetUrl).searchParams.get("token");
}

beforeEach(() => {
  sendPasswordResetMail.mockReset();
});

describe("parola sıfırlama", () => {
  it("kullanıcının var olup olmadığını sızdırmaz", async () => {
    await createUser({ email: "var@example.com" });

    const existing = await request(app).post("/api/auth/forgot-password").send({ email: "var@example.com" });
    const missing = await request(app).post("/api/auth/forgot-password").send({ email: "yok@example.com" });

    expect(existing.status).toBe(200);
    expect(missing.status).toBe(200);
    expect(existing.body).toEqual(missing.body);
    expect(sendPasswordResetMail).toHaveBeenCalledTimes(1);
  });

  it("token'ı hash'leyerek saklar ve link ile gönderir", async () => {
    const user = await createUser();
    await request(app).post("/api/auth/forgot-password").send({ email: user.email });

    const token = tokenFromMail();
    expect(token).toBeTruthy();
    expect(await PasswordResetToken.exists({ tokenHash: token })).toBeNull();
    expect(await PasswordResetToken.countDocuments({ user: user._id })).toBe(1);
  });

  it("token tek kullanımlıktır ve oturumları sonlandırır", async () => {
    const user = await createUser();
    await loginAgent(app, user);
    await request(app).post("/api/auth/forgot-password").send({ email: user.email });
    const token = tokenFromMail();

    const payload = { token, password: "YeniParola9", passwordConfirm: "YeniParola9" };
    const first = await request(app).post("/api/auth/reset-password").send(payload);
    const second = await request(app).post("/api/auth/reset-password").send(payload);

    expect(first.status).toBe(200);
    expect(second.status).toBe(400);
    expect(await RefreshToken.countDocuments({ user: user._id, revokedAt: null })).toBe(0);

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "YeniParola9" });
    expect(login.status).toBe(200);
  });

  it("süresi dolmuş token'ı reddeder", async () => {
    const user = await createUser();
    await request(app).post("/api/auth/forgot-password").send({ email: user.email });
    const token = tokenFromMail();
    await PasswordResetToken.updateMany({}, { $set: { expiresAt: new Date(Date.now() - 1000) } });

    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, password: "YeniParola9", passwordConfirm: "YeniParola9" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("RESET_TOKEN_INVALID");
  });

  it("yalnızca e-posta ile parola değiştirmeye izin vermez", async () => {
    const user = await createUser();
    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({ email: user.email, password: "YeniParola9", passwordConfirm: "YeniParola9" });
    expect(response.status).toBe(400);
  });
});
