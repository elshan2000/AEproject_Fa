import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { productUpdateSchema } from "@/lib/validations/product";
import {
  deleteProduct,
  getProductByIdOrSlug,
  updateProduct,
} from "@/services/product.service";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id] — public. The segment accepts an id OR a slug, since
 * Next.js forbids two different dynamic param names at the same route level.
 */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await getProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    return handleRouteError(err);
  }
}

/** PUT /api/products/[id] — admin only. */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const input = productUpdateSchema.parse(body);
    const product = await updateProduct(id, input);
    return NextResponse.json(product);
  } catch (err) {
    return handleRouteError(err);
  }
}

/** DELETE /api/products/[id] — admin only. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await deleteProduct(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
