import { PrismaClient } from "@prisma/client";

/**
 * A single shared PrismaClient instance.
 *
 * In development Next.js hot-reloads modules on every save. Without this guard
 * each reload would create a brand-new PrismaClient and open a new pool of DB
 * connections, quickly exhausting Postgres ("too many connections"). Caching the
 * instance on `globalThis` survives hot reloads. In production a single instance
 * is created normally.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
