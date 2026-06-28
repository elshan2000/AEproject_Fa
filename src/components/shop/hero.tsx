import Image from "next/image";
import Link from "next/link";
import { VolumeX } from "lucide-react";
import { demoImages } from "@/lib/demo-images";
import { Reveal } from "@/components/shop/reveal";

// Editorial hero (matches the reference mockup): a full-bleed figure-with-bouquet
// image bleeding to the top/right edges, an oversized faded KAYA wordmark behind,
// and the headline lowered to the mid-left. Pulled up under the (transparent)
// sticky header via -mt-20.
export function Hero() {
  return (
    <section className="relative -mt-20 min-h-screen overflow-hidden bg-background">
      {/* Full-bleed image: top band on mobile, end-side ~54% on desktop (left in RTL) */}
      <div className="absolute inset-x-0 top-0 h-[48vh] sm:h-[56vh] lg:inset-y-0 lg:start-auto lg:end-0 lg:h-full lg:w-[54%]">
        <Image
          src={demoImages.hero}
          alt="گل‌آرایی ادیتوریال کایا"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 54vw"
          className="object-cover"
        />
        {/* Soft fade into the canvas on the inner edge so the wordmark + text blend */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background/95 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background"
        />
      </div>

      {/* Oversized faded brand wordmark */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[15%] select-none text-center font-display text-[26vw] font-semibold leading-none tracking-[0.08em] text-foreground/[0.05]"
      >
        KAYA
      </span>

      {/* Content (mid-left) */}
      <div className="section relative flex min-h-screen flex-col justify-end pb-20 pt-[48vh] sm:pt-[56vh] lg:justify-center lg:pb-0 lg:pt-20">
        <div className="max-w-xl">
          <Reveal>
            <h1 className="font-latin text-5xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Addicted
              <br />
              to
              <br />
              Flowers
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-xl font-medium leading-snug text-foreground sm:text-2xl">
              جایی که گل و مُد به هم می‌رسند
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              گل‌آرایی‌هایی دست‌ساز و فاخر، با نگاهی مدرن و ادیتوریال به زیبایی.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center bg-foreground px-9 py-4 font-latin text-[11px] uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-80"
            >
              Shop Collection
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Decorative slide counter (right edge) */}
      <div
        aria-hidden
        className="absolute end-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 font-latin text-xs text-foreground lg:flex"
      >
        <span>01</span>
        <span className="h-8 w-px bg-foreground/30" />
        <span className="text-foreground/50">02</span>
        <span className="text-foreground/50">03</span>
      </div>

      {/* Mute + year (bottom-right) */}
      <div
        aria-hidden
        className="absolute bottom-8 end-8 z-10 hidden items-center gap-3 lg:flex"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/30 text-background backdrop-blur">
          <VolumeX strokeWidth={1.5} className="h-4 w-4" />
        </span>
        <span className="font-latin text-xs tracking-[0.3em] text-foreground">
          2024
        </span>
      </div>
    </section>
  );
}
