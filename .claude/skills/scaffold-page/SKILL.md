---
name: scaffold-page
description: Scaffold a new (shop) route for کایا following the products/[slug] pattern — a Server Component page.tsx that fetches via a @/services module, generateMetadata() with notFound() in BOTH metadata and body for dynamic routes, optional loading.tsx skeleton and not-found.tsx, and force-dynamic where live data is needed. Use when adding a new storefront page.
---

# scaffold-page

Scaffold a new storefront route under `src/app/(shop)/` matching the existing
App Router conventions (server-first data fetching, Persian metadata, RTL).

## Inputs to gather (ask only if missing)
1. **Route path** — e.g. `collections`, `collections/[slug]`, `faq`.
2. **Dynamic?** Does it have a `[param]`? → needs `generateMetadata` + `notFound()` handling.
3. **Data source** — which `@/services/*` function fetches it (e.g. `getProductBySlug`, `listProducts`)? If none exists yet, note that a service function must be added (services live in `src/services/`, return DTOs from `src/types`).

## Hard rules
- **Server Component** page (no `"use client"` at the page level). Interactive bits go in child client components.
- Fetch data via a **service** from `@/services/*` (never call Prisma directly in the page). Services return serializable DTOs.
- `export const metadata` (static pages) or `export async function generateMetadata()` (dynamic) — title/description in **Persian**.
- **Dynamic-route 404 gotcha**: call `notFound()` in **both** `generateMetadata()` and the page body when the record is missing (calling it only in the body yields a soft-404 with a 200 status).
- Use `export const dynamic = "force-dynamic"` when the page must reflect live DB data.
- RTL/logical CSS, theme tokens, `.section` wrapper, `font-serif` headings — same as `new-component`.
- The `(shop)/layout.tsx` already provides Navbar/Footer/WhatsAppFab — don't re-add them.

## Templates

### Static page — `src/app/(shop)/<route>/page.tsx`
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عنوان صفحه",
  description: "توضیح کوتاه برای موتورهای جستجو.",
};

export default function Page() {
  return (
    <div className="section py-12">
      <h1 className="font-serif text-3xl font-semibold">عنوان صفحه</h1>
      {/* content */}
    </div>
  );
}
```

### Dynamic page — `src/app/(shop)/<route>/[slug]/page.tsx`
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemBySlug } from "@/services/item.service";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound(); // 404 in metadata too — avoids soft-404
  return { title: item.name, description: item.summary };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound(); // 404 in body as well

  return (
    <div className="section py-12">
      <h1 className="font-serif text-3xl font-semibold">{item.name}</h1>
      {/* content */}
    </div>
  );
}
```

### Loading skeleton — `src/app/(shop)/<route>/loading.tsx`
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="section py-12 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

## Finish
Run `npm run typecheck`. Confirm the route renders (`npm run dev`, visit the path).
If a new service function was needed, scaffold it in `src/services/` returning a DTO,
and add it to `src/types` if a new shape is introduced.
