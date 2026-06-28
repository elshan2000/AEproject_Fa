import Image from "next/image";
import Link from "next/link";
import { collectionImages } from "@/lib/demo-images";
import { Reveal } from "@/components/shop/reveal";

// Curated editorial collections. English brand labels + a Persian caption; each
// tile links to a real category filter so the storefront stays functional.
const COLLECTIONS = [
  { name: "Signature", href: "/products?category=roses", img: collectionImages.signature },
  { name: "Romantic", href: "/products?category=bouquets", img: collectionImages.romantic },
  { name: "Minimal", href: "/products?category=wedding", img: collectionImages.minimal },
  { name: "Luxury", href: "/products?category=plants", img: collectionImages.luxury },
];

export function Collection() {
  return (
    <section className="section py-24">
      <div className="mb-12 flex items-end justify-between">
        <h2 className="font-latin text-sm font-medium uppercase tracking-[0.25em] text-foreground">
          Shop by Collection
        </h2>
        <Link
          href="/products"
          className="text-xs text-foreground transition-opacity hover:opacity-60"
        >
          مشاهدهٔ همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.name} delay={i * 90}>
            <Link href={c.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={c.img}
                  alt={`${c.name} Collection`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 font-latin text-sm font-medium uppercase tracking-[0.15em] text-foreground">
                {c.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">مجموعه</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
