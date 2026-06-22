import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/svg+xml", "svg"],
]);

/**
 * POST /api/admin/upload — admin only. Accepts a single `file` (multipart) and
 * stores it under /public/uploads, returning its public URL.
 *
 * NOTE: this writes to the local filesystem, which suits a Node/VPS deploy. On
 * read-only/serverless hosts (e.g. Vercel) swap this for S3/Cloudinary — the
 * rest of the app only depends on the returned `url`.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "فایلی ارسال نشد" }, { status: 400 });
    }
    const ext = ALLOWED.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { error: "فرمت تصویر پشتیبانی نمی‌شود (JPG, PNG, WebP, AVIF, SVG)" },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "حجم تصویر باید کمتر از ۴ مگابایت باشد" },
        { status: 413 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${ext}`;
    const dest = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(dest, bytes);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
