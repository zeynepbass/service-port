import { z } from "zod";

export const emailRule = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "E-posta zorunludur")
  .max(254)
  .pipe(z.email("Geçerli bir e-posta adresi girin"));

export const passwordRule = z
  .string()
  .min(8, "Parola en az 8 karakter olmalıdır")
  .max(72, "Parola en fazla 72 karakter olabilir")
  .regex(/[A-Za-zÇĞİÖŞÜçğıöşü]/, "Parola en az bir harf içermelidir")
  .regex(/[0-9]/, "Parola en az bir rakam içermelidir");

export const personNameRule = z.string().trim().min(1, "Bu alan zorunludur").max(50, "En fazla 50 karakter");

export const phoneRule = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s()-]{7,20}$/, "Geçerli bir telefon numarası girin");

export function safeRedirectPath(value, fallback = "/ana-sayfa") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
