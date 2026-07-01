import "server-only";
import { cookies, headers } from "next/headers";
import { env } from "@/lib/env";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";
import type { SessionUser } from "@/types";

// Re-export so existing imports from "@/lib/auth" keep working.
export {
  SESSION_COOKIE,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";

/** Thrown when an admin-only operation is attempted without a valid session. */
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** Write the session cookie (httpOnly, secure in prod). */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Remove the session cookie (logout). */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Read & verify the current session from the request cookie, falling back to
 * an `Authorization: Bearer <token>` header. The header path lets the native
 * (React Native) admin app authenticate without cookies.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (cookieToken) return verifySessionToken(cookieToken);

  const headerList = await headers();
  const authHeader = headerList.get("authorization");
  const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearerToken) return null;
  return verifySessionToken(bearerToken);
}

/** Convenience: sign a token for `user` and set the cookie. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  await setSessionCookie(token);
}

/** Return the session or throw UnauthorizedError. Use to guard mutations. */
export async function requireAdmin(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
