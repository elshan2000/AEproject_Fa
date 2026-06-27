import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Editorial / image-led hero: a full-bleed brand illustration with the headline
// overlaid on the start (right, in RTL) side, which the artwork keeps light for
// legibility. Scrims are vertical so they stay correct regardless of direction.
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative min-h-[70vh] w-full lg:min-h-[80vh]">
        <Image
          src="/images/hero/editorial-hero.svg"
          alt="آرایش گلِ دست‌چین کایا"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Readability scrims (vertical = RTL-safe) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-background/20"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent"
        />
      </div>

      <div className="section absolute inset-0 flex items-center">
        <div className="max-w-xl animate-fade-in space-y-6 text-start">
          <p className="eyebrow">تازه · فصلی · دست‌چین</p>
          <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.12] sm:text-6xl lg:text-7xl">
            گل، زبانِ دل
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            دسته‌گل‌های دست‌سازِ کایا برای زیباترین لحظه‌های زندگی — چیده‌شده با
            ظرافت و تحویل سر وقت.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/products">مشاهدهٔ مجموعه</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">داستان ما</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
