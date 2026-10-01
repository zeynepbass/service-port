import { describe, expect, it } from "vitest";
import { registerSchema } from "@/features/auth/utils/schemas";
import { contactSchema } from "@/features/request/utils/schemas";
import { passwordRule, safeRedirectPath } from "./validation";

describe("doğrulama kuralları", () => {
  it("parola kuralları backend ile aynıdır", () => {
    expect(passwordRule.safeParse("Parola123").success).toBe(true);
    expect(passwordRule.safeParse("kisa1").success).toBe(false);
    expect(passwordRule.safeParse("sadeceharf").success).toBe(false);
    expect(passwordRule.safeParse("12345678").success).toBe(false);
  });

  it("kayıt formunda e-postayı normalize eder", () => {
    const result = registerSchema.parse({
      firstName: "A",
      lastName: "B",
      email: " A@B.COM ",
      password: "Parola123",
    });
    expect(result.email).toBe("a@b.com");
  });

  it("geçmiş bitiş tarihini reddeder", () => {
    expect(contactSchema.safeParse({ phone: "", endsAt: "2000-01-01", location: null }).success).toBe(false);
    expect(contactSchema.safeParse({ phone: "", endsAt: "", location: null }).success).toBe(true);
  });

  it("yalnızca site içi yönlendirmeye izin verir", () => {
    expect(safeRedirectPath("/hizmet/1")).toBe("/hizmet/1");
    expect(safeRedirectPath("//evil.com")).toBe("/ana-sayfa");
    expect(safeRedirectPath("https://evil.com")).toBe("/ana-sayfa");
  });
});
