import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, toPersianDigits } from "@/lib/utils";

/**
 * Server-rendered pagination. Builds hrefs from the current search params so it
 * works without client JS and preserves active filters.
 */
export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border hover:bg-accent"
    );

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      {/* In RTL, "previous" points right and "next" points left. */}
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={linkClass(false)} aria-label="صفحهٔ قبل">
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={linkClass(p === page)}
          aria-current={p === page ? "page" : undefined}
        >
          {toPersianDigits(p)}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className={linkClass(false)} aria-label="صفحهٔ بعد">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
