"use server";

import { ZodError } from "zod";
import { loginSchema } from "@/lib/validations/auth";
import { verifyCredentials } from "@/services/auth.service";
import { clearSessionCookie, createSession } from "@/lib/auth";
import type { ActionResult } from "@/actions/types";

/**
 * Authenticate an admin and set the session cookie.
 * Returns a generic error on failure to avoid revealing whether the email
 * exists (no user enumeration).
 */
export async function loginAction(input: unknown): Promise<ActionResult> {
  try {
    const { email, password } = loginSchema.parse(input);
    const user = await verifyCredentials(email, password);
    if (!user) {
      return { success: false, error: "ایمیل یا رمز عبور نادرست است." };
    }
    await createSession(user);
    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        success: false,
        error: "لطفاً اطلاعات ورود را بررسی کنید.",
        fieldErrors: err.flatten().fieldErrors,
      };
    }
    console.error("Login action error:", err);
    return { success: false, error: "ورود ناموفق بود. لطفاً دوباره تلاش کنید." };
  }
}

/** Clear the session cookie (logout). */
export async function logoutAction(): Promise<ActionResult> {
  await clearSessionCookie();
  return { success: true, data: undefined };
}
