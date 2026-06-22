"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Flower2,
  Tags,
  MessageSquare,
  Menu,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "@/components/admin/logout-button";

const links = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "محصولات", href: "/admin/products", icon: Flower2 },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Tags },
  { label: "پیام‌ها", href: "/admin/inquiries", icon: MessageSquare },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <Link href="/admin" className="font-serif text-xl font-semibold">
        {siteConfig.name}
        <span className="block text-xs font-normal text-muted-foreground">
          پنل مدیریت
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <div className="space-y-1 border-t border-border/60 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground/70 hover:bg-accent"
        >
          <ExternalLink className="h-4 w-4" />
          مشاهدهٔ سایت
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-l border-border/60 bg-card p-5 lg:block">
        <SidebarBody />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card px-4 py-3 lg:hidden">
        <span className="font-serif text-lg font-semibold">
          {siteConfig.name}
        </span>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="باز کردن منو">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetTitle className="sr-only">منوی مدیریت</SheetTitle>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
