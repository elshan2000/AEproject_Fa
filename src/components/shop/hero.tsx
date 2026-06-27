import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Flower2, Leaf, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

// Editorial / image-led hero for the flower studio: full-bleed brand
// illustration, a studio badge, staggered reveal, floating floral accents and a
// feature strip. Scrims are vertical so they stay correct regardless of
// direction; decorative accents are positioned with logical (start/end) insets.
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative min-h-[78vh] w-full lg:min-h-[88vh]">
        {/* Light + dark illustrations; CSS swaps them with the theme. */}
        <Image
          src="/images/hero/editorial-hero.svg"
          alt="آرایش گلِ دست‌چین کایا"
          fill
          priority
          sizes="100vw"
          className="object-cover dark:hidden"
        />
        <Image
          src="/images/hero/editorial-hero-dark.svg"
          alt="آرایش گلِ دست‌چین کایا"
          fill
          sizes="100vw"
          className="hidden object-cover dark:block"
        />
        {/* Readability scrims (vertical = RTL-safe) */}
        <div aria-hidden className="absolute inset-0 bg-background/20" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent"
        />

        {/* Floating floral bokeh accents — drift gently over the bloom side */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span
            className="animate-float absolute end-[8%] top-[20%] h-24 w-24 rounded-full bg-primary/15 blur-2xl"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="animate-float absolute end-[22%] top-[55%] h-32 w-32 rounded-full bg-accent/50 blur-2xl"
            style={{ animationDelay: "1.4s" }}
          />
          <span
            className="animate-float absolute bottom-[14%] end-[5%] h-20 w-20 rounded-full bg-secondary/70 blur-xl"
            style={{ animationDelay: "2.8s" }}
          />
          <span
            className="animate-float absolute start-[6%] top-[30%] hidden h-16 w-16 rounded-full bg-primary/10 blur-2xl lg:block"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </div>

      <div className="section absolute inset-0 flex items-center">
        <div className="max-w-xl space-y-6 text-start">
          <span
            className="hero-rise inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm"
            style={{ animationDelay: "0ms" }}
          >
            <Flower2 className="h-3.5 w-3.5" />
            استودیوی گل کایا
          </span>

          <h1
            className="hero-rise text-balance font-serif text-5xl font-semibold leading-[1.12] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            هنرِ گل،
            <br />
            به سبکِ کایا
          </h1>

          <p
            className="hero-rise max-w-md text-lg leading-relaxed text-muted-foreground"
            style={{ animationDelay: "240ms" }}
          >
            گل‌آرایی‌هایی دست‌ساز و فاخر، برای آنان که اصالت و ظرافت را
            می‌شناسند.
          </p>

          <div
            className="hero-rise flex flex-wrap gap-3 pt-1"
            style={{ animationDelay: "360ms" }}
          >
            <Button asChild size="lg">
              <Link href="/products">مشاهدهٔ مجموعه</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">داستان ما</Link>
            </Button>
          </div>

          <div
            className="hero-rise flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 text-sm text-muted-foreground"
            style={{ animationDelay: "480ms" }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              گل‌آراییِ سفارشی
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-primary" />
              تحویل در همان روز
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-primary" />
              گل‌های تازهٔ روز
            </span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <span className="animate-float flex flex-col items-center gap-1 text-xs text-muted-foreground">
          بیشتر ببینید
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </section>
  );
}
