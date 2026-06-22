/**
 * Shared, **serializable** domain types (DTOs).
 *
 * Prisma models expose `Prisma.Decimal` and `Date` objects which cannot cross
 * the Server→Client Component boundary. The service layer maps Prisma rows into
 * these plain types (price as `number`, dates as ISO `string`) so Client
 * Components receive safe, JSON-serializable data and we never use `any`.
 */

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

/** A product joined with its category — used on cards & detail pages. */
export interface ProductWithCategory extends ProductDTO {
  category: CategoryDTO;
}

/** A category enriched with how many products it contains (for filters). */
export interface CategoryWithCount extends CategoryDTO {
  productCount: number;
}

export interface InquiryDTO {
  id: string;
  customerName: string;
  phone: string;
  message: string;
  productId: string | null;
  createdAt: string;
}

/** Inquiry joined with the (optional) product name, for the admin feed. */
export interface InquiryWithProduct extends InquiryDTO {
  product: { id: string; name: string; slug: string } | null;
}

/** Generic paginated envelope returned by list services & the REST API. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Query parameters accepted by the product listing service. */
export interface ProductListParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
}

/** Shape of the authenticated admin stored in the session token. */
export interface SessionUser {
  id: string;
  email: string;
}
