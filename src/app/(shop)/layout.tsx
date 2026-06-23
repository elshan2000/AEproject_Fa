import { Navbar } from "@/components/shop/navbar";
import { Footer } from "@/components/shop/footer";
import { WhatsAppFab } from "@/components/shop/whatsapp-button";

// All shop pages fetch live data from the DB — render on each request.
export const dynamic = "force-dynamic";

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
