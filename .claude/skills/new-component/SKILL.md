---
name: new-component
description: Scaffold a new React component for کایا that matches the project's conventions — correct Server/Client decision, @/ aliases, cn() for classes, logical RTL CSS, HSL theme tokens, @/types DTOs (never raw Prisma rows), formatPrice/toPersianDigits for numbers, lucide-react icons, shadcn/ui primitives, and React Hook Form + Zod for forms. Use when creating a new shop or admin component.
---

# new-component

Scaffold a new component under `src/components/shop/` or `src/components/admin/`
that is indistinguishable from the existing code.

## Inputs to gather (ask only if missing)
1. **Name** (PascalCase export, kebab-case file — e.g. `PromoBanner` → `promo-banner.tsx`).
2. **Area**: `shop` or `admin`.
3. **Interactive?** Does it need state/effects/event handlers/hooks? → decides `"use client"`.
4. **Data it renders** — map to an existing DTO in `@/types` if it shows products/categories/inquiries.

## Hard rules (match the codebase)

- **Server by default.** Add `"use client"` **only** when the component uses state, effects,
  refs, browser APIs, or event handlers. Most display components stay Server Components.
- **Imports use `@/` aliases** (`@/components/ui/...`, `@/lib/utils`, `@/types`). No relative `../..`.
- **Class merging via `cn()`** from `@/lib/utils` whenever combining/conditional classes.
- **Logical RTL CSS only**: `ms/me`, `ps/pe`, `start/end`, `border-s/border-e`, `text-start/end`.
  Never `ml/mr`, `pl/pr`, `left/right`.
- **Theme tokens, not hard-coded colors**: `bg-background`, `text-foreground`, `text-primary`,
  `bg-secondary`, `text-muted-foreground`, `border-border`, `ring-ring`. No raw hex/`#`.
- **Headings** (`h1`–`h3`) use `font-serif` (matches `globals.css`).
- **Numbers**: `formatPrice(value)` for prices, `toPersianDigits(n)` for counts, `formatDate(iso)` for dates.
- **DTOs at the client boundary**: accept types from `@/types` (e.g. `ProductWithCategory`),
  never raw Prisma rows.
- **Images**: `next/image` `<Image>` with `fill` + `object-cover` + responsive `sizes` + real `alt`.
- **Icons**: `lucide-react`.
- **Primitives**: reuse `@/components/ui/*` (Button, Card, Badge, Input, Select, Dialog, Sheet…) — don't hand-roll.
- **Section width**: wrap full-bleed sections with the `.section` helper (`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8`).

## Forms (when the component is a form)
- React Hook Form + `zodResolver(schema)`; schema lives in `@/lib/validations/*` with **Persian messages**.
- `Controller` for `Select` and other controlled Radix inputs (see `product-form.tsx`).
- Numeric inputs get `dir="ltr"`.
- Submit calls a server action returning `ActionResult<T>` from `@/actions/*`; surface field errors via `setError`, success/error via the `useToast` hook.

## Templates

### Server display component
```tsx
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ProductWithCategory } from "@/types";

export function PromoBanner({ product }: { product: ProductWithCategory }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute start-3 top-3">
          {product.featured && <Badge>ویژه</Badge>}
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-serif text-lg font-medium leading-snug">{product.name}</h3>
        <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
```

### Client interactive component
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Counter({ className }: { className?: string }) {
  const [count, setCount] = useState(0);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="secondary" onClick={() => setCount((c) => c + 1)}>
        افزودن
      </Button>
    </div>
  );
}
```

## Finish
After writing, run `npm run typecheck`. Then run the `rtl-audit` skill mentally (or
suggest it) on the new file. Report the file path and how to use the component.
