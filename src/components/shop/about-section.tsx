import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="section grid items-center gap-12 py-20 lg:grid-cols-2">
      <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
        <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-secondary to-accent/60" />
        <div className="mt-8 aspect-[3/4] rounded-2xl bg-gradient-to-b from-accent/60 to-primary/15" />
      </div>
      <div className="order-1 space-y-5 lg:order-2">
        <p className="eyebrow">داستان ما</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">
          یک استودیوی کوچک با عشق به گل
        </h2>
        <p className="text-muted-foreground">
          کایا با یک باور ساده آغاز شد: گل‌هایی که با ظرافت چیده شوند می‌توانند
          یک روز معمولی را به خاطره‌ای ماندگار تبدیل کنند. هر دسته‌گل با دست و از
          تازه‌ترین شاخه‌های فصلی آماده می‌شود.
        </p>
        <p className="text-muted-foreground">
          از کوچک‌ترین محبت‌ها تا بزرگ‌ترین جشن‌ها، ما در هر گلبرگ ظرافت به کار
          می‌بریم تا شما چیزی واقعاً زیبا را هدیه کنید.
        </p>
        <Button asChild variant="outline">
          <Link href="/about">بیشتر دربارهٔ ما</Link>
        </Button>
      </div>
    </section>
  );
}
