"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "@/lib/validations/category";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  CategoryHasProductsError,
  CategoryNotFoundError,
  DuplicateCategoryError,
} from "@/services/category.service";
import type { ActionResult, FieldErrors } from "@/actions/types";
import type { CategoryDTO } from "@/types";

function revalidateCategorySurfaces() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
}

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
  if (err instanceof DuplicateCategoryError) {
    return { success: false, error: err.message };
  }
  if (err instanceof CategoryHasProductsError) {
    return {
      success: false,
      error: "Move or delete this category's products first.",
    };
  }
  if (err instanceof CategoryNotFoundError) {
    return { success: false, error: "Category not found." };
  }
  console.error("Category action error:", err);
  return { success: false, error: "Something went wrong. Please try again." };
}

export async function createCategoryAction(
  input: unknown
): Promise<ActionResult<CategoryDTO>> {
  try {
    await requireAdmin();
    const data = categoryCreateSchema.parse(input);
    const category = await createCategory(data);
    revalidateCategorySurfaces();
    return { success: true, data: category };
  } catch (err) {
    return toFailure(err);
  }
}

export async function updateCategoryAction(
  id: string,
  input: unknown
): Promise<ActionResult<CategoryDTO>> {
  try {
    await requireAdmin();
    const data = categoryUpdateSchema.parse(input);
    const category = await updateCategory(id, data);
    revalidateCategorySurfaces();
    return { success: true, data: category };
  } catch (err) {
    return toFailure(err);
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteCategory(id);
    revalidateCategorySurfaces();
    return { success: true, data: undefined };
  } catch (err) {
    return toFailure(err);
  }
}
