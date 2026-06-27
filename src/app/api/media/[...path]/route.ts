import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Serve user-uploaded files from public/uploads via a DYNAMIC route instead of
// Next's static `public/` handler. In `output: "standalone"`, files written to
// public/ at runtime aren't served until the server restarts — so admin uploads
// looked broken until `docker compose down/up`. Reading from disk per-request
// fixes that. A beforeFiles rewrite maps /uploads/:path* -> /api/media/:path*,
// so stored URLs (and the DB) stay unchanged and next/image keeps working.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const resolved = path.resolve(UPLOADS_DIR, segments.join("/"));

  // Path-traversal guard: the resolved file must stay inside UPLOADS_DIR.
  if (resolved !== UPLOADS_DIR && !resolved.startsWith(UPLOADS_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(resolved).toLowerCase()];
  if (!contentType) {
    return new Response("Unsupported media type", { status: 415 });
  }

  try {
    const file = await readFile(resolved);
    return new Response(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
