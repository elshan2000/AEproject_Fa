import { Header } from "@/components/shop/header";
import { Footer } from "@/components/shop/footer";
import { WhatsAppFab } from "@/components/shop/whatsapp-button";

// All shop pages fetch live data from the DB — render on each request.
export const dynamic = "force-dynamic";

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Persian RTL storefront (inherits dir="rtl" from the root <html>). The brand
  // wordmark + a few editorial accent words stay latin (Playfair/Inter).
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
