import { z } from "zod";

/**
 * Validates environment variables at module load. If anything required is
 * missing or malformed the process throws immediately with a readable error,
 * instead of failing deep inside a request with a cryptic stack trace.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
  // Used to sign the admin session JWT. Must be long & random in production.
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
  // Public site URL — used for absolute URLs in metadata/sitemap.
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`❌ Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
export type Env = typeof env;
