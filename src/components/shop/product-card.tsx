import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

// Minimal editorial product card: image, name, price. No badges, no colorful
// buttons — just a slow hover zoom.
export function ProductCard({ product }: { product: ProductWithCategory }) {
  const soldOut = product.stock <= 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[11px] text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <p className="text-sm text-foreground/80">
          {soldOut ? "ناموجود" : formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
