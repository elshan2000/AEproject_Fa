import { Navbar } from "@/components/shop/navbar";
import { Footer } from "@/components/shop/footer";
import { WhatsAppFab } from "@/components/shop/whatsapp-button";

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
