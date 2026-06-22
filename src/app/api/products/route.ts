import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError } from "@/lib/api";
import { productCreateSchema, productQuerySchema } from "@/lib/validations/product";
import { createProduct, listProducts } from "@/services/product.service";

/** GET /api/products — public, paginated list with filter/search/sort. */
export async function GET(request: NextRequest) {
  try {
    const { category, ...rest } = productQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    const result = await listProducts({ ...rest, categorySlug: category });
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST /api/products — admin only, creates a product. */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = productCreateSchema.parse(body);
    const product = await createProduct(input);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
