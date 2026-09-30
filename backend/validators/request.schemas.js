import { z } from "zod";
import { cursorQuery, location, objectId, phone } from "./common.js";

export const REQUEST_STATUSES = ["active", "passive", "cancelled"];

const futureDate = z.coerce
  .date()
  .refine((date) => date.getTime() > Date.now(), "Bitiş tarihi gelecekte olmalıdır");

export const createRequestSchema = z
  .object({
    categoryId: objectId,
    answers: z
      .array(
        z.object({
          question: z.string().trim().min(1).max(200),
          selected: z.string().trim().min(1).max(100),
        }),
      )
      .min(1)
      .max(30),
    phone: phone.optional(),
    location: location.nullable().optional(),
    endsAt: futureDate.nullable().optional(),
  })
  .strict();

export const updateRequestSchema = z
  .object({
    phone: phone.optional(),
    location: location.nullable().optional(),
    endsAt: futureDate.nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, "Güncellenecek en az bir alan gönderin");

export const updateStatusSchema = z.object({ status: z.enum(REQUEST_STATUSES) }).strict();

export const listRequestsQuery = cursorQuery.extend({
  scope: z.enum(["mine", "others", "all"]).default("all"),
  category: z.string().trim().max(100).optional(),
  status: z.enum(REQUEST_STATUSES).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().max(500).default(25),
});
