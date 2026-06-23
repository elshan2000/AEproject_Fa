import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/** GET /api/auth/session — return the current admin, or 401 if not signed in. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: session });
}
