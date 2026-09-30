import { z } from "zod";
import { email, personName, phone } from "./common.js";

export const updateProfileSchema = z
  .object({
    firstName: personName.optional(),
    lastName: personName.optional(),
    email: email.optional(),
    phone: phone.optional(),
  })
  .strict();

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Parola zorunludur").max(72),
});
