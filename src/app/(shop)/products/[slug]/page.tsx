import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductGrid } from "@/components/shop/product-grid";
import { SectionHeading } from "@/components/shop/section-heading";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/services/product.service";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // Throwing notFound() here (before the page streams) lets Next commit a
  // proper 404 status instead of a soft-404 (200 with not-found content).
  if (!product) notFound();

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.id,
    product.categoryId,
    4
  );

  const inStock = product.stock > 0;
  // Pre-fill a WhatsApp enquiry with the product name.
  const waText = encodeURIComponent(
    `سلام! من به دسته‌گل «${product.name}» علاقه‌مندم.`
  );

  return (
    <div className="section py-12 lg:py-20">
      <Link
        href="/products"
        className="mb-10 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronRight className="h-4 w-4" /> بازگشت به فروشگاه
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
        <ProductGallery imageUrl={product.imageUrl} alt={product.name} />

        <div className="flex flex-col lg:py-4">
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-medium">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              · {inStock ? "موجود" : "ناموجود"}
            </span>
          </div>

          <p className="mt-7 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" disabled={!inStock}>
              <Link href={`/contact?product=${product.slug}`}>
                ثبت سفارش / استعلام
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={`https://wa.me/${siteConfig.phoneE164}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-4 w-4" /> واتساپ
              </a>
            </Button>
          </div>

          <ul className="mt-10 space-y-3 border-t border-border pt-8 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Sparkles strokeWidth={1.5} className="h-4 w-4 text-foreground" />{" "}
              دست‌چین‌شده با شاخه‌های تازهٔ فصلی
            </li>
            <li className="flex items-center gap-3">
              <Truck strokeWidth={1.5} className="h-4 w-4 text-foreground" /> امکان
              تحویل همان‌روز در تهران
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <SectionHeading align="left" title="شاید بپسندید" />
          <div className="mt-10">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
