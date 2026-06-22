import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function ContactCta() {
  return (
    <section className="section py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-8 py-16 text-center text-primary-foreground sm:px-16">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
          به‌دنبال سفارش ویژه هستید؟
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
          مناسبت خود را برای ما بگویید تا دسته‌گلی بسازیم که فقط برای شما طراحی
          شده است.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">تماس با ما</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a href={`tel:${siteConfig.phoneE164}`}>تماس: {siteConfig.phone}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
