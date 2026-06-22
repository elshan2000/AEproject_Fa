import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { inquiryCreateSchema } from "@/lib/validations/inquiry";
import { createInquiry, getAllInquiries } from "@/services/inquiry.service";

/** GET /api/inquiries — admin only, newest first. */
export async function GET() {
  try {
    await requireAdmin();
    const inquiries = await getAllInquiries();
    return NextResponse.json(inquiries);
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST /api/inquiries — public, creates a customer inquiry. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = inquiryCreateSchema.parse(body);
    const inquiry = await createInquiry(input);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
