import Link from "next/link";
import { SectionHeading } from "@/components/shop/section-heading";
import { toPersianDigits } from "@/lib/utils";
import type { CategoryWithCount } from "@/types";

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
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border/60 bg-card p-6 text-center transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <span className="font-serif text-lg font-medium group-hover:text-primary">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {toPersianDigits(category.productCount)} محصول
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
