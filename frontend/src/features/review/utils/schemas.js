import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Lütfen bir yıldız seçin").max(5),
  comment: z.string().trim().max(1000, "Yorum en fazla 1000 karakter olabilir"),
});
