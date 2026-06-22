import { Hero } from "@/components/shop/hero";
import { FeaturedProducts } from "@/components/shop/featured-products";
import { CategorySection } from "@/components/shop/category-section";
import { AboutSection } from "@/components/shop/about-section";
import { ContactCta } from "@/components/shop/contact-cta";
import { getFeaturedProducts } from "@/services/product.service";
import { listCategories } from "@/services/category.service";

// Home is a Server Component: it reads data directly on the server for fast,
// SEO-friendly rendering with no client-side fetch waterfall.
export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(4),
    listCategories(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <CategorySection categories={categories} />
      <AboutSection />
      <ContactCta />
    </>
  );
}
