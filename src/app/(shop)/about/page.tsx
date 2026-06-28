import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shop/section-heading";
import { aboutImages } from "@/lib/demo-images";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "داستان کایا؛ استودیویی کوچک با عشق به گل، و ماموریت ما برای ساختن لحظه‌های ماندگار.",
};

const values = [
  {
    icon: Leaf,
    title: "تازگی فصلی",
    text: "هر روز از تازه‌ترین شاخه‌های فصل استفاده می‌کنیم.",
  },
  {
    icon: Heart,
    title: "ساخت با دست",
    text: "هر دسته‌گل با دقت و سلیقه، دست‌چین و آماده می‌شود.",
  },
  {
    icon: Sparkles,
    title: "جزئیات لوکس",
    text: "از انتخاب گل تا بسته‌بندی، به ظرافت اهمیت می‌دهیم.",
  },
];

export default function AboutPage() {
  return (
    <div className="section py-12 lg:py-20">
      <SectionHeading
        align="left"
        eyebrow="داستان ما"
        title="استودیویی کوچک با عشق به گل"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-5 leading-relaxed text-muted-foreground">
          <p>
            {siteConfig.name} با یک باور ساده آغاز شد: گل‌هایی که با ظرافت چیده
            شوند می‌توانند یک روز معمولی را به خاطره‌ای ماندگار تبدیل کنند. ما کار
            را در یک استودیوی کوچک و با عشق به طبیعت شروع کردیم.
          </p>
          <p>
            امروز هم همان روحیه را حفظ کرده‌ایم؛ هر سفارش برای ما یک داستان است و
            هر دسته‌گل با همان دقت روز اول آماده می‌شود.
          </p>

          <div className="border-s-2 border-foreground bg-secondary p-6">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              ماموریت ما
            </h3>
            <p className="mt-2">
              ما می‌خواهیم سهمی کوچک در زیباتر کردن لحظه‌های شما داشته باشیم؛ با
              گل‌هایی تازه، طراحی‌ای دلنشین و خدماتی که می‌توانید به آن اعتماد
              کنید.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={aboutImages.one}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={aboutImages.two}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values — minimal */}
      <div className="mt-20 grid gap-10 sm:grid-cols-3">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="border-t border-border pt-6">
              <Icon strokeWidth={1.25} className="h-7 w-7 text-foreground" />
              <h3 className="mt-4 font-serif text-lg font-medium">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Contact strip — dark band */}
      <div className="mt-20 flex flex-wrap items-center justify-between gap-6 bg-foreground px-8 py-10 text-background">
        <div>
          <h3 className="font-serif text-2xl font-semibold">سؤالی دارید؟</h3>
          <p className="mt-2 text-sm text-background/70">
            تلفن:{" "}
            <a
              href={`tel:${siteConfig.phoneE164}`}
              dir="ltr"
              className="hover:text-background"
            >
              {siteConfig.phone}
            </a>{" "}
            · {siteConfig.address}
          </p>
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link href="/contact">تماس با ما</Link>
        </Button>
      </div>
    </div>
  );
}
