import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/product-grid";
import { SectionHeading } from "@/components/shop/section-heading";
import { EmptyState } from "@/components/shop/empty-state";
import type { ProductWithCategory } from "@/types";

export function FeaturedProducts({
  products,
}: {
  products: ProductWithCategory[];
}) {
  return (
    <section className="section py-20">
      <SectionHeading
        eyebrow="برگزیده برای شما"
        title="دسته‌گل‌های ویژه"
        description="گزیده‌ای دست‌چین از محبوب‌ترین دسته‌گل‌های ما."
      />
      <div className="mt-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            title="هنوز محصول ویژه‌ای نداریم"
            description="به‌زودی سر بزنید — چیزهای زیبایی در حال شکفتن است."
          />
        )}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/products">مشاهدهٔ همهٔ گل‌ها</Link>
        </Button>
      </div>
    </section>
  );
}
