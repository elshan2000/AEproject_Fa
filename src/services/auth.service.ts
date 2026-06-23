import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types";

/**
 * A valid bcrypt hash of a random value, compared against when the email is not
 * found. This keeps the response time roughly constant whether or not the
 * account exists, mitigating user-enumeration via timing.
 */
const DUMMY_HASH =
  "$2a$12$MeyHoqQv/N65ozqcjUM4Ju1Zvtc8Z7fKBIVXmKPC2wTqNgUTzG8tO";

/**
 * Verify admin credentials. Returns the session user on success, or null on
 * any failure (wrong email OR wrong password — never reveal which).
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Always run a bcrypt comparison to avoid leaking account existence by timing.
  const hash = admin?.passwordHash ?? DUMMY_HASH;
  const passwordMatches = await bcrypt.compare(password, hash);

  if (!admin || !passwordMatches) return null;
  return { id: admin.id, email: admin.email };
}
