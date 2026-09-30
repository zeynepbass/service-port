import mongoose from "mongoose";
import { z } from "zod";

export const objectId = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), "Geçersiz kimlik");

export const idParams = z.object({ id: objectId });

export const email = z
  .string({ error: "E-posta zorunludur" })
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email("Geçerli bir e-posta adresi girin"));

export const password = z
  .string()
  .min(8, "Parola en az 8 karakter olmalıdır")
  .max(72, "Parola en fazla 72 karakter olabilir")
  .regex(/[A-Za-zÇĞİÖŞÜçğıöşü]/, "Parola en az bir harf içermelidir")
  .regex(/[0-9]/, "Parola en az bir rakam içermelidir");

export const personName = z.string().trim().min(1, "Bu alan zorunludur").max(50);

const emptyToNull = (value) => (value === "" || value === undefined ? null : value);

export const phone = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Geçerli bir telefon numarası girin")
    .nullable(),
);

export const location = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const cursorQuery = z.object({
  cursor: z.string().max(64).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
