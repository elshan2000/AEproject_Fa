import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/shop/section-heading";
import { toPersianDigits } from "@/lib/utils";
import type { CategoryWithCount } from "@/types";

// Representative illustration per category, keyed by the (stable, latin) slug.
// Unknown/new categories fall back to a generic bloom until art is designed.
const CATEGORY_IMAGES: Record<string, string> = {
  bouquets: "/images/categories/bouquets.svg",
  roses: "/images/categories/roses.svg",
  wedding: "/images/categories/wedding.svg",
  plants: "/images/categories/plants.svg",
  seasonal: "/images/categories/seasonal.svg",
};
const DEFAULT_CATEGORY_IMAGE = "/images/categories/default.svg";

export function CategorySection({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-20">
      <div className="section">
        <SectionHeading
          eyebrow="خرید بر اساس مناسبت"
          title="گل مناسب خود را بیابید"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/40">
                <Image
                  src={CATEGORY_IMAGES[category.slug] ?? DEFAULT_CATEGORY_IMAGE}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <span className="font-serif text-xl font-medium group-hover:text-primary">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {toPersianDigits(category.productCount)} محصول
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
