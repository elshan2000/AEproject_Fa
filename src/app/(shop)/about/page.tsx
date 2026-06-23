import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shop/section-heading";
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
    <div className="py-12 lg:py-16">
      <div className="section">
        <SectionHeading
          align="left"
          eyebrow="داستان ما"
          title="استودیویی کوچک با عشق به گل"
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-muted-foreground">
            <p>
              {siteConfig.name} با یک باور ساده آغاز شد: گل‌هایی که با ظرافت چیده
              شوند می‌توانند یک روز معمولی را به خاطره‌ای ماندگار تبدیل کنند. ما
              کار را در یک استودیوی کوچک و با عشق به طبیعت شروع کردیم.
            </p>
            <p>
              امروز هم همان روحیه را حفظ کرده‌ایم؛ هر سفارش برای ما یک داستان است
              و هر دسته‌گل با همان دقت روز اول آماده می‌شود.
            </p>

            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-6">
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
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-secondary to-accent/60" />
            <div className="mt-8 aspect-[3/4] rounded-2xl bg-gradient-to-b from-accent/60 to-primary/15" />
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="rounded-2xl border border-border/60 bg-card p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-medium">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
              </div>
            );
          })}
        </div>

        {/* Contact strip */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary/50 px-6 py-8">
          <div>
            <h3 className="font-serif text-xl font-semibold">
              سؤالی دارید؟
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              تلفن:{" "}
              <a
                href={`tel:${siteConfig.phoneE164}`}
                dir="ltr"
                className="hover:text-primary"
              >
                {siteConfig.phone}
              </a>{" "}
              · {siteConfig.address}
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">تماس با ما</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
