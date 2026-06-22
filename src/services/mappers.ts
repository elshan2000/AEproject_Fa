import type { Category, Inquiry, Product } from "@prisma/client";
import type {
  CategoryDTO,
  InquiryDTO,
  InquiryWithProduct,
  ProductDTO,
  ProductWithCategory,
} from "@/types";

/**
 * Mappers convert Prisma rows (which contain `Prisma.Decimal` and `Date`
 * objects that cannot cross the Server→Client boundary) into plain,
 * JSON-serializable DTOs. Every service returns DTOs, never raw Prisma models.
 */

export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function toProductDTO(product: Product): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price), // Decimal -> number
    imageUrl: product.imageUrl,
    stock: product.stock,
    featured: product.featured,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function toProductWithCategory(
  product: Product & { category: Category }
): ProductWithCategory {
  return {
    ...toProductDTO(product),
    category: toCategoryDTO(product.category),
  };
}

export function toInquiryDTO(inquiry: Inquiry): InquiryDTO {
  return {
    id: inquiry.id,
    customerName: inquiry.customerName,
    phone: inquiry.phone,
    message: inquiry.message,
    productId: inquiry.productId,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export function toInquiryWithProduct(
  inquiry: Inquiry & {
    product: { id: string; name: string; slug: string } | null;
  }
): InquiryWithProduct {
  return {
    ...toInquiryDTO(inquiry),
    product: inquiry.product,
  };
}
