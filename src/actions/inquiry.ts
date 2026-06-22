"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { inquiryCreateSchema } from "@/lib/validations/inquiry";
import { createInquiry } from "@/services/inquiry.service";
import type { ActionResult, FieldErrors } from "@/actions/types";

/**
 * Public action: submit a customer inquiry from the contact form.
 * No auth required; validated server-side.
 */
export async function createInquiryAction(
  input: unknown
): Promise<ActionResult> {
  try {
    const data = inquiryCreateSchema.parse(input);
    await createInquiry(data);
    // Refresh the admin views that surface inquiries.
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: FieldErrors = err.flatten().fieldErrors;
      return {
        success: false,
        error: "لطفاً فیلدهای مشخص‌شده را اصلاح کنید.",
        fieldErrors,
      };
    }
    console.error("Inquiry action error:", err);
    return {
      success: false,
      error: "ارسال پیام ناموفق بود. لطفاً دوباره تلاش کنید.",
    };
  }
}
