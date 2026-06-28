import { Flower, Flower2, Gift, Truck } from "lucide-react";
import { Reveal } from "@/components/shop/reveal";

// Bilingual: Persian title + small latin caption + Persian subtitle.
const FEATURES = [
  { icon: Flower, fa: "گل‌های اختصاصی", en: "Exclusive Flowers", sub: "گزینش ممتاز برای شما" },
  { icon: Flower2, fa: "سفارش سفارشی", en: "Custom Orders", sub: "طراحی ویژهٔ شما" },
  { icon: Truck, fa: "ارسال در همان روز", en: "Same Day Delivery", sub: "سریع و مطمئن" },
  { icon: Gift, fa: "بسته‌بندی لوکس", en: "Luxury Packaging", sub: "ظرافت در هر جزئیات" },
];

export function FeatureSection() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="section grid grid-cols-2 gap-x-8 gap-y-12 py-16 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal
            key={f.en}
            delay={i * 80}
            className="flex flex-col items-center text-center"
          >
            <f.icon strokeWidth={1} className="h-9 w-9 text-foreground" />
            <h3 className="mt-5 text-sm font-medium text-foreground">{f.fa}</h3>
            <p className="mt-1.5 font-latin text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {f.en}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{f.sub}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
