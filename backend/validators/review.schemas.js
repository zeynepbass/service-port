import { z } from "zod";
import { cursorQuery, objectId } from "./common.js";

export const createReviewSchema = z
  .object({
    targetId: objectId,
    requestId: objectId.nullable().optional(),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).nullable().optional(),
  })
  .strict();

export const listReviewsQuery = cursorQuery.extend({ user: objectId });
