"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import type { CategoryWithCount } from "@/types";

const ALL = "all";

export function ProductsFilters({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search, 350);
  const isFirstRender = useRef(true);

  const category = searchParams.get("category") ?? ALL;
  const sort = searchParams.get("sort") ?? "newest";

  /** Build a new query string, reset to page 1 on any filter change. */
  function pushParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === ALL) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Apply the debounced search term to the URL (skip the initial mount).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    pushParams({ search: debouncedSearch || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی گل..."
          className="ps-9"
          aria-label="جستجوی محصولات"
        />
      </div>

      <Select
        value={category}
        onValueChange={(value) => pushParams({ category: value })}
      >
        <SelectTrigger className="sm:w-48" aria-label="فیلتر بر اساس دسته">
          <SelectValue placeholder="دسته‌بندی" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>همهٔ دسته‌ها</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.slug}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => pushParams({ sort: value })}
      >
        <SelectTrigger className="sm:w-44" aria-label="مرتب‌سازی محصولات">
          <SelectValue placeholder="مرتب‌سازی" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">جدیدترین</SelectItem>
          <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
          <SelectItem value="price-desc">گران‌ترین</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
