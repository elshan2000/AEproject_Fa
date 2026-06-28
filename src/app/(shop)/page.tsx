import { Hero } from "@/components/shop/hero";
import { Collection } from "@/components/shop/collection";
import { About } from "@/components/shop/about";

// Editorial home page — Hero → Collection → About. Storefront chrome
// (Header/Footer) lives in the (shop) layout.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Collection />
      <About />
    </>
  );
}
