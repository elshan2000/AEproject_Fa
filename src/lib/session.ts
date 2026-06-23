import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "@/types";

/**
 * Edge-safe session token logic (pure jose). This module is imported by both
 * `middleware.ts` (edge runtime) and `lib/auth.ts` (node), so it must NOT use
 * `server-only`, `next/headers`, Prisma, or Node-only APIs.
 */

export const SESSION_COOKIE = "fs_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)
const ISSUER = "maison-fleur";

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short");
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session JWT for the given admin user. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** Verify a session token; returns the user or null if invalid/expired. */
export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
