import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9؀-ۿ]+(?:-[a-z0-9؀-ۿ]+)*$/,
      "Slug must be lowercase letters/numbers separated by dashes"
    )
    .max(80)
    .optional(),
});

export const categoryUpdateSchema = categoryCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
