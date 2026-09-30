import { z } from "zod";
import { emailRule, passwordRule, personNameRule } from "@/shared/utils/validation";

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, "Parola zorunludur"),
});

export const registerSchema = z.object({
  firstName: personNameRule,
  lastName: personNameRule,
  email: emailRule,
  password: passwordRule,
});

export const forgotPasswordSchema = z.object({ email: emailRule });

export const resetPasswordSchema = z
  .object({
    password: passwordRule,
    passwordConfirm: z.string().min(1, "Parola tekrarı zorunludur"),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: "Parolalar eşleşmiyor",
    path: ["passwordConfirm"],
  });
