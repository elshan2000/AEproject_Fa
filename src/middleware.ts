import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const LOGIN_PATH = "/admin/login";

/**
 * Guards the admin area. Runs on the edge runtime, so it only uses the
 * edge-safe session module (no Prisma / next/headers).
 *
 * - Unauthenticated users hitting /admin/* are redirected to the login page
 *   (with `?from=` so we can return them after signing in).
 * - Authenticated users hitting /admin/login are sent to the dashboard.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (pathname === LOGIN_PATH) {
    if (user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect everything under /admin (the matcher excludes static assets).
  matcher: ["/admin/:path*"],
};
