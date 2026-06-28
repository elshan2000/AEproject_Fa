import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/shop/contact-form";
import { WhatsAppButton } from "@/components/shop/whatsapp-button";
import { SectionHeading } from "@/components/shop/section-heading";
import { getProductBySlug } from "@/services/product.service";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "برای سفارش گل، مشاوره یا هر پرسشی با کایا در تماس باشید — تلفن، واتساپ و فرم تماس.",
};

type SearchParams = Promise<{ product?: string }>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { product: productSlug } = await searchParams;
  const product = productSlug ? await getProductBySlug(productSlug) : null;

  return (
    <div className="section py-12 lg:py-20">
      <SectionHeading
        align="left"
        eyebrow="در خدمت شما هستیم"
        title="تماس با ما"
        description="برای سفارش، مشاوره یا هر پرسشی خوشحال می‌شویم صدای شما را بشنویم."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Contact details */}
        <div className="space-y-8">
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <Phone strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
              <div>
                <p className="text-sm font-medium">تلفن</p>
                <a
                  href={`tel:${siteConfig.phoneE164}`}
                  dir="ltr"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Mail strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
              <div>
                <p className="text-sm font-medium">ایمیل</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  dir="ltr"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {siteConfig.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <MapPin strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
              <div>
                <p className="text-sm font-medium">نشانی</p>
                <p className="text-sm text-muted-foreground">{siteConfig.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Clock strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
              <div>
                <p className="text-sm font-medium">ساعات کاری</p>
                <p className="text-sm text-muted-foreground">{siteConfig.hours}</p>
              </div>
            </li>
          </ul>

          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              ترجیح می‌دهید سریع‌تر پاسخ بگیرید؟
            </p>
            <WhatsAppButton
              text={
                product
                  ? `سلام! دربارهٔ «${product.name}» سؤال داشتم.`
                  : "سلام! می‌خواستم دربارهٔ سفارش گل بپرسم."
              }
            />
          </div>
        </div>

        {/* Form */}
        <div className="border border-border bg-card p-6 sm:p-8">
          <h2 className="mb-6 font-serif text-2xl font-semibold">پیام بگذارید</h2>
          <ContactForm
            productSlug={product?.slug}
            productName={product?.name}
          />
        </div>
      </div>
    </div>
  );
}
