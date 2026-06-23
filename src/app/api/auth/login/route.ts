import { NextRequest, NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api";
import { loginSchema } from "@/lib/validations/auth";
import { verifyCredentials } from "@/services/auth.service";
import { createSession } from "@/lib/auth";

/** POST /api/auth/login — verify credentials and set the session cookie. */
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

    await createSession(user);
    return NextResponse.json({ user });
  } catch (err) {
    return handleRouteError(err);
  }
}
