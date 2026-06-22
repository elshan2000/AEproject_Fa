import { z } from "zod";

export const inquiryCreateSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "نام باید حداقل ۲ نویسه باشد")
    .max(80, "نام بیش از حد طولانی است"),
  phone: z
    .string()
    .trim()
    .min(7, "شمارهٔ تماس معتبر نیست")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "شمارهٔ تماس فقط می‌تواند شامل ارقام باشد"),
  message: z
    .string()
    .trim()
    .min(5, "پیام باید حداقل ۵ نویسه باشد")
    .max(2000, "پیام بیش از حد طولانی است"),
  // Optional slug of the product the customer is enquiring about.
  productSlug: z.string().trim().optional(),
});

export type InquiryCreateInput = z.infer<typeof inquiryCreateSchema>;
