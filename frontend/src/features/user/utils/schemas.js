import { z } from "zod";
import { emailRule, personNameRule, phoneRule } from "@/shared/utils/validation";

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const profileSchema = z.object({
  firstName: personNameRule,
  lastName: personNameRule,
  email: emailRule,
  phone: z.union([z.literal(""), phoneRule]),
});

export function validateAvatar(file) {
  if (!AVATAR_TYPES.includes(file.type)) return "Yalnızca JPG, PNG veya WEBP yükleyebilirsiniz";
  if (file.size > MAX_AVATAR_BYTES) return "Dosya boyutu en fazla 5 MB olabilir";
  return null;
}

export const deleteAccountSchema = z.object({ password: z.string().min(1, "Parola zorunludur") });
