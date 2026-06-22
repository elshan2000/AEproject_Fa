import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ProductWithCategory } from "@/types";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const soldOut = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute start-3 top-3 flex gap-2">
          {product.featured && <Badge>ویژه</Badge>}
          {soldOut && <Badge variant="secondary">ناموجود</Badge>}
        </div>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="font-serif text-lg font-medium leading-snug">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
