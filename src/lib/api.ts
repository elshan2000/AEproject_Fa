import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnauthorizedError } from "@/lib/auth";
import {
  DuplicateSlugError,
  ProductNotFoundError,
} from "@/services/product.service";
import {
  CategoryHasProductsError,
  CategoryNotFoundError,
  DuplicateCategoryError,
} from "@/services/category.service";

export interface ApiErrorBody {
  error: string;
  details?: Record<string, string[] | undefined>;
}

/** Map a thrown error to a typed JSON HTTP response. */
export function handleRouteError(err: unknown): NextResponse<ApiErrorBody> {
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: err.flatten().fieldErrors },
      { status: 400 }
    );
  }
  if (err instanceof UnauthorizedError) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
  if (
    err instanceof ProductNotFoundError ||
    err instanceof CategoryNotFoundError
  ) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
  if (
    err instanceof DuplicateSlugError ||
    err instanceof DuplicateCategoryError ||
    err instanceof CategoryHasProductsError
  ) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }

  console.error("Unhandled API error:", err);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
