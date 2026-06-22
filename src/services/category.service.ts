import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugifyWithFallback } from "@/lib/utils";
import { toCategoryDTO } from "@/services/mappers";
import type { CategoryDTO, CategoryWithCount } from "@/types";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@/lib/validations/category";

export class DuplicateCategoryError extends Error {
  constructor(field: "name" | "slug", value: string) {
    super(`A category with ${field} "${value}" already exists`);
    this.name = "DuplicateCategoryError";
  }
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super("Category not found");
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryHasProductsError extends Error {
  constructor() {
    super("Cannot delete a category that still has products");
    this.name = "CategoryHasProductsError";
  }
}

/** All categories with their product counts (alphabetical). */
export async function listCategories(): Promise<CategoryWithCount[]> {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return rows.map((c) => ({
    ...toCategoryDTO(c),
    productCount: c._count.products,
  }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryDTO | null> {
  const row = await prisma.category.findUnique({ where: { slug } });
  return row ? toCategoryDTO(row) : null;
}

export async function createCategory(
  input: CategoryCreateInput
): Promise<CategoryDTO> {
  const slug = input.slug?.trim() || slugifyWithFallback(input.name);

  const clash = await prisma.category.findFirst({
    where: { OR: [{ name: input.name }, { slug }] },
  });
  if (clash) {
    throw new DuplicateCategoryError(
      clash.slug === slug ? "slug" : "name",
      clash.slug === slug ? slug : input.name
    );
  }

  const created = await prisma.category.create({
    data: { name: input.name, slug },
  });
  return toCategoryDTO(created);
}

export async function updateCategory(
  id: string,
  input: CategoryUpdateInput
): Promise<CategoryDTO> {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new CategoryNotFoundError();

  const slug =
    input.slug?.trim() || (input.name ? slugifyWithFallback(input.name) : existing.slug);

  const clash = await prisma.category.findFirst({
    where: {
      AND: [
        { NOT: { id } },
        { OR: [{ name: input.name ?? existing.name }, { slug }] },
      ],
    },
  });
  if (clash) {
    throw new DuplicateCategoryError(
      clash.slug === slug ? "slug" : "name",
      slug
    );
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name: input.name, slug },
  });
  return toCategoryDTO(updated);
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") throw new CategoryNotFoundError();
      // Foreign-key violation: products still reference this category.
      if (err.code === "P2003") throw new CategoryHasProductsError();
    }
    throw err;
  }
}
