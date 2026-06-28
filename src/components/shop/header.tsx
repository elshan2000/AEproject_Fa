"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shop/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV = [
  { en: "COLLECTION", fa: "مجموعه", href: "/products" },
  { en: "EDITORIAL", fa: "ادیتوریال", href: "/products" },
  { en: "ABOUT", fa: "درباره", href: "/about" },
  { en: "CUSTOM ORDER", fa: "سفارش سفارشی", href: "/contact" },
];

// Transparent over the hero, turns to a solid bar with a hairline border once
// the page is scrolled. Sticky (not fixed) so non-hero pages flow below it.
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-20 w-full transition-colors duration-500",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="section flex h-20 items-center justify-between">
        {/* Logo (start = left in LTR) */}
        <Link href="/" className="leading-none" aria-label="KAYA Floral Studio">
          <span className="block font-display text-2xl font-semibold tracking-[0.25em] text-foreground">
            KAYA
          </span>
          <span className="mt-1 block font-latin text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Floral Studio
          </span>
        </Link>

        {/* Centered nav (desktop) */}
        <nav className="absolute inset-x-0 mx-auto hidden w-fit md:block">
          <ul className="flex items-center gap-10">
            {NAV.map((item) => (
              <li key={item.en}>
                <Link
                  href={item.href}
                  className={cn(
                    "font-latin text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-60",
                    isActive(item.href) ? "text-foreground" : "text-foreground/70"
                  )}
                >
                  {item.en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons (end = right in LTR) */}
        <div className="flex items-center gap-5">
          <Link
            href="/products"
            aria-label="Search"
            className="hidden transition-opacity hover:opacity-60 md:block"
          >
            <Search strokeWidth={1.5} className="h-5 w-5" />
          </Link>
          <Link
            href="/admin"
            aria-label="Account"
            className="hidden transition-opacity hover:opacity-60 md:block"
          >
            <User strokeWidth={1.5} className="h-5 w-5" />
          </Link>
          <Link
            href="/products"
            aria-label="Cart"
            className="transition-opacity hover:opacity-60"
          >
            <ShoppingBag strokeWidth={1.5} className="h-5 w-5" />
          </Link>

          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="transition-opacity hover:opacity-60 md:hidden"
            >
              <Menu strokeWidth={1.5} className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="mb-8 font-display text-xl tracking-[0.25em]">
                KAYA
              </SheetTitle>
              <ul className="flex flex-col">
                {NAV.map((item) => (
                  <li key={item.en}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-border py-4 text-sm transition-opacity hover:opacity-60"
                    >
                      <span>{item.fa}</span>
                      <span className="font-latin text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {item.en}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
