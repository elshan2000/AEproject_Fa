/**
 * Serializable DTOs mirroring the web app's src/types/index.ts. Kept as a
 * standalone copy (no cross-project import) since the mobile app is a
 * separate Expo/Metro project.
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

export interface ProductWithCategory extends ProductDTO {
  category: CategoryDTO;
}

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

export interface InquiryWithProduct extends InquiryDTO {
  product: { id: string; name: string; slug: string } | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc";
}

export interface SessionUser {
  id: string;
  email: string;
}

export interface AdminStats {
  productCount: number;
  categoryCount: number;
  featuredCount: number;
  inquiryCount: number;
}

export interface ApiErrorBody {
  error: string;
  details?: Record<string, string[] | undefined>;
}
