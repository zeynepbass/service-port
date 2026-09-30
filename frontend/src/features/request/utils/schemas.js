import { z } from "zod";
import { phoneRule } from "@/shared/utils/validation";

export function stepSchema(options) {
  return z.object({
    selected: z.enum(options, { error: "Devam etmek için bir seçenek belirleyin" }),
  });
}

export const contactSchema = z
  .object({
    phone: z.union([z.literal(""), phoneRule]),
    endsAt: z
      .string()
      .refine(
        (value) => value === "" || new Date(`${value}T23:59:59`).getTime() > Date.now(),
        "Bitiş tarihi bugünden sonra olmalıdır",
      ),
    location: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  });

export function toContactPayload(values, dirtyFields) {
  const payload = {};
  if (dirtyFields.phone) payload.phone = values.phone || null;
  if (dirtyFields.endsAt) payload.endsAt = values.endsAt ? new Date(`${values.endsAt}T23:59:59`).toISOString() : null;
  if (dirtyFields.location) payload.location = values.location;
  return payload;
}
