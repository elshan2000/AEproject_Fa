import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { categoryCreateSchema } from "@/lib/validations/category";
import { createCategory, listCategories } from "@/services/category.service";

/** GET /api/categories — public, with product counts. */
export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json(categories);
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST /api/categories — admin only. */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = categoryCreateSchema.parse(body);
    const category = await createCategory(input);
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
