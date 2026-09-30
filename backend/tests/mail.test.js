import { describe, expect, it } from "vitest";
import { sendPasswordResetMail } from "../services/mail.service.js";

describe("mail servisi", () => {
  it("sıfırlama bağlantısını ve süresini içeren e-posta oluşturur", async () => {
    const info = await sendPasswordResetMail({
      to: "ayse@example.com",
      firstName: "Ayşe",
      resetUrl: "http://localhost:3000/sifre-sifirla?token=abc",
      expiresInMinutes: 30,
    });
    const message = JSON.parse(info.message);

    expect(message.to[0].address).toBe("ayse@example.com");
    expect(message.text).toContain("http://localhost:3000/sifre-sifirla?token=abc");
    expect(message.text).toContain("30 dakika");
  });
});
