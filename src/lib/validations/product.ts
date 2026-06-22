import { z } from "zod";

/** Shared field rules reused by create & update. */
const productFields = {
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name is too long"),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9؀-ۿ]+(?:-[a-z0-9؀-ۿ]+)*$/,
      "Slug must be lowercase letters/numbers separated by dashes"
    )
    .max(140)
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .max(1_000_000, "Price is unrealistically high"),
  imageUrl: z
    .string()
    .trim()
    .min(1, "An image is required")
    .max(2048),
  stock: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  featured: z.coerce.boolean().default(false),
  categoryId: z.string().trim().min(1, "Please choose a category"),
};

/** Validates the body for creating a product. */
export const productCreateSchema = z.object(productFields);

/** Validates the body for updating a product (all fields optional). */
export const productUpdateSchema = z
  .object(productFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/** Validates & coerces the product listing query parameters. */
export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  // URL param is `category` (a slug) to match the storefront links.
  category: z.string().trim().optional(),
  search: z.string().trim().max(120).optional(),
  featured: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).default("newest"),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

/**
 * Client-side form schema (Persian messages). Numeric fields are strings here
 * because HTML inputs return strings; the server action re-validates and
 * coerces them via `productCreateSchema`.
 */
export const productFormSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ نویسه باشد").max(120),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9؀-ۿ]+(?:-[a-z0-9؀-ۿ]+)*$/,
      "اسلاگ باید با حروف/ارقام و خط‌تیره باشد"
    )
    .max(140)
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(10, "توضیحات باید حداقل ۱۰ نویسه باشد")
    .max(5000),
  price: z
    .string()
    .trim()
    .min(1, "قیمت الزامی است")
    .refine((v) => Number(v) > 0, "قیمت باید بزرگتر از صفر باشد"),
  stock: z
    .string()
    .trim()
    .min(1, "موجودی الزامی است")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "موجودی باید عددی صحیح و نامنفی باشد"
    ),
  imageUrl: z.string().trim().min(1, "تصویر محصول الزامی است"),
  categoryId: z.string().trim().min(1, "انتخاب دسته‌بندی الزامی است"),
  featured: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
