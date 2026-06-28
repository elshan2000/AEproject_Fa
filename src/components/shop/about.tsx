import Image from "next/image";
import Link from "next/link";
import { demoImages } from "@/lib/demo-images";
import { Reveal } from "@/components/shop/reveal";

// Latin number + Persian label (Playfair has no Persian glyphs).
const STATS = [
  { value: "+500", fa: "سفارش اختصاصی" },
  { value: "+1000", fa: "مشتری خشنود" },
  { value: "+50", fa: "رویداد و همکاری" },
];

// Full-width dark band with a faded floral backdrop, statement copy and stats.
export function About() {
  return (
    <section className="relative isolate overflow-hidden bg-foreground text-background">
      <Image
        src={demoImages.about}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-foreground/40" aria-hidden />

      <div className="section relative grid gap-12 py-28 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="font-latin text-[11px] uppercase tracking-[0.4em] text-background/60">
            Kaya Floral Studio
          </p>
          <h2 className="mt-4 font-display text-5xl font-medium text-background sm:text-6xl">
            About Kaya
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-background/75">
            کایا یک استودیوی طراحی گل است؛ با الهام از مُد، هنر و طبیعت. ما برای
            ماندگارترین لحظه‌های زندگی، گل‌آرایی‌هایی بی‌زمان می‌آفرینیم.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center border border-background/40 px-9 py-3.5 text-sm text-background transition-colors hover:bg-background hover:text-foreground"
          >
            بیشتر بدانید
          </Link>
        </Reveal>

        <div className="flex flex-col gap-10 lg:items-end">
          {STATS.map((s, i) => (
            <Reveal key={s.fa} delay={i * 100} className="text-start lg:text-end">
              <p className="font-display text-5xl font-semibold sm:text-6xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-background/70">{s.fa}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
