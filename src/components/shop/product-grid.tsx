import { ProductCard } from "@/components/shop/product-card";
import type { ProductWithCategory } from "@/types";

export function ProductGrid({
  products,
}: {
  products: ProductWithCategory[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
