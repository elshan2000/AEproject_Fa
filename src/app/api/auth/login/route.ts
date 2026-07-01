import { NextRequest, NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api";
import { loginSchema } from "@/lib/validations/auth";
import { verifyCredentials } from "@/services/auth.service";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

/**
 * POST /api/auth/login — verify credentials, set the session cookie (web),
 * and also return the signed token in the JSON body (native/mobile clients,
 * which can't rely on the HttpOnly cookie, store this and send it back as
 * `Authorization: Bearer <token>`).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await verifyCredentials(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "ایمیل یا رمز عبور نادرست است." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user);
    await setSessionCookie(token);
    return NextResponse.json({ user, token });
  } catch (err) {
    return handleRouteError(err);
  }
}
