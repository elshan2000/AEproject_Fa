import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { categoryUpdateSchema } from "@/lib/validations/category";
import { deleteCategory, updateCategory } from "@/services/category.service";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/categories/[id] — admin only. */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const input = categoryUpdateSchema.parse(body);
    const category = await updateCategory(id, input);
    return NextResponse.json(category);
  } catch (err) {
    return handleRouteError(err);
  }
}

/** DELETE /api/categories/[id] — admin only. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteCategory(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
