import { z } from "zod";
import { email, password, personName } from "./common.js";

export const registerSchema = z.object({
  firstName: personName,
  lastName: personName,
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Parola zorunludur").max(72),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    token: z.string().min(20).max(200),
    password,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Parolalar eşleşmiyor",
    path: ["passwordConfirm"],
  });
