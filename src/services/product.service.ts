import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify, slugifyWithFallback } from "@/lib/utils";
import { toProductDTO, toProductWithCategory } from "@/services/mappers";
import type {
  PaginatedResult,
  ProductDTO,
  ProductListParams,
  ProductWithCategory,
} from "@/types";
import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/lib/validations/product";

/** Thrown when a slug already exists. Surfaced as a 409 by the API. */
export class DuplicateSlugError extends Error {
  constructor(slug: string) {
    super(`A product with slug "${slug}" already exists`);
    this.name = "DuplicateSlugError";
  }
}

/** Thrown when a product cannot be found. Surfaced as a 404 by the API. */
export class ProductNotFoundError extends Error {
  constructor() {
    super("Product not found");
    this.name = "ProductNotFoundError";
  }
}

const withCategory = { category: true } as const;

function buildOrderBy(
  sort: ProductListParams["sort"]
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

/**
 * Paginated product listing with optional category filter, full-text-ish
 * search (name + description), featured filter, and sorting.
 */
export async function listProducts(
  params: ProductListParams
): Promise<PaginatedResult<ProductWithCategory>> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? 12));

  const where: Prisma.ProductWhereInput = {};

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }
  if (typeof params.featured === "boolean") {
    where.featured = params.featured;
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: withCategory,
      orderBy: buildOrderBy(params.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: rows.map(toProductWithCategory),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Featured products for the home page. */
export async function getFeaturedProducts(
  limit = 4
): Promise<ProductWithCategory[]> {
  const rows = await prisma.product.findMany({
    where: { featured: true },
    include: withCategory,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProductWithCategory);
}

/** Single product by slug (used by the public detail page). */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: withCategory,
  });
  return row ? toProductWithCategory(row) : null;
}

/** Single product by id OR slug (used by the REST GET endpoint). */
export async function getProductByIdOrSlug(
  idOrSlug: string
): Promise<ProductWithCategory | null> {
  const row = await prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: withCategory,
  });
  return row ? toProductWithCategory(row) : null;
}

/** Related products: same category, excluding the current product. */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
): Promise<ProductWithCategory[]> {
  const rows = await prisma.product.findMany({
    where: { categoryId, NOT: { id: productId } },
    include: withCategory,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProductWithCategory);
}

/** Admin: list every product (newest first) for the dashboard table. */
export async function getAllProducts(): Promise<ProductWithCategory[]> {
  const rows = await prisma.product.findMany({
    include: withCategory,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProductWithCategory);
}

async function ensureSlugUnique(slug: string, excludeId?: string) {
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing && existing.id !== excludeId) {
    throw new DuplicateSlugError(slug);
  }
}

/** Create a product. Derives the slug from the name when not provided. */
export async function createProduct(
  input: ProductCreateInput
): Promise<ProductDTO> {
  const slug = input.slug?.trim() || slugifyWithFallback(input.name);
  await ensureSlugUnique(slug);

  const created = await prisma.product.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      price: new Prisma.Decimal(input.price),
      imageUrl: input.imageUrl,
      stock: input.stock,
      featured: input.featured,
      categoryId: input.categoryId,
    },
  });
  return toProductDTO(created);
}

/** Update a product by id. */
export async function updateProduct(
  id: string,
  input: ProductUpdateInput
): Promise<ProductDTO> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new ProductNotFoundError();

  const slug =
    input.slug?.trim() ||
    (input.name ? slugifyWithFallback(input.name) : undefined);
  if (slug && slug !== existing.slug) {
    await ensureSlugUnique(slug, id);
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug,
      description: input.description,
      price:
        input.price !== undefined ? new Prisma.Decimal(input.price) : undefined,
      imageUrl: input.imageUrl,
      stock: input.stock,
      featured: input.featured,
      categoryId: input.categoryId,
    },
  });
  return toProductDTO(updated);
}

/** Delete a product by id. */
export async function deleteProduct(id: string): Promise<void> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      throw new ProductNotFoundError();
    }
    throw err;
  }
}
