"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import {
  productCreateSchema,
  productUpdateSchema,
} from "@/lib/validations/product";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  DuplicateSlugError,
  ProductNotFoundError,
} from "@/services/product.service";
import type { ActionResult, FieldErrors } from "@/actions/types";
import type { ProductDTO } from "@/types";

/** Revalidate every surface a product change can affect. */
function revalidateProductSurfaces() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

/** Map a thrown error to a failed ActionResult with a friendly message. */
function toFailure(err: unknown): { success: false; error: string; fieldErrors?: FieldErrors } {
  if (err instanceof ZodError) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: err.flatten().fieldErrors,
    };
  }
  if (err instanceof UnauthorizedError) {
    return { success: false, error: "You must be signed in as an admin." };
  }
  if (err instanceof DuplicateSlugError) {
    return { success: false, error: err.message };
  }
  if (err instanceof ProductNotFoundError) {
    return { success: false, error: "Product not found." };
  }
  console.error("Product action error:", err);
  return { success: false, error: "Something went wrong. Please try again." };
}

export async function createProductAction(
  input: unknown
): Promise<ActionResult<ProductDTO>> {
  try {
    await requireAdmin();
    const data = productCreateSchema.parse(input);
    const product = await createProduct(data);
    revalidateProductSurfaces();
    return { success: true, data: product };
  } catch (err) {
    return toFailure(err);
  }
}

export async function updateProductAction(
  id: string,
  input: unknown
): Promise<ActionResult<ProductDTO>> {
  try {
    await requireAdmin();
    const data = productUpdateSchema.parse(input);
    const product = await updateProduct(id, data);
    revalidateProductSurfaces();
    revalidatePath(`/products/${product.slug}`);
    return { success: true, data: product };
  } catch (err) {
    return toFailure(err);
  }
}

export async function deleteProductAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteProduct(id);
    revalidateProductSurfaces();
    return { success: true, data: undefined };
  } catch (err) {
    return toFailure(err);
  }
}
