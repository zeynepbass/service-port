import { z } from "zod";

const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Geçerli bir görsel adresi girin");

export const createCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().max(500).nullable().optional(),
    image: imageUrl.nullable().optional(),
  })
  .strict();

export const updateCategorySchema = createCategorySchema.partial().strict();

export const categoryKeyParams = z.object({ key: z.string().trim().min(1).max(100) });

export const templateSchema = z
  .object({
    steps: z
      .array(
        z.object({
          question: z.string().trim().min(2).max(200),
          options: z.array(z.string().trim().min(1).max(100)).min(2).max(20),
        }),
      )
      .min(1)
      .max(30),
  })
  .strict();
