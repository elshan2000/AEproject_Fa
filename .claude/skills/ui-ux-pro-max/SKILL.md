---
name: ui-ux-pro-max
description: Senior UI/UX design mode for کایا — produces polished, on-brand, accessible Persian/RTL interfaces. Encodes the luxury-florist brand (warm white, muted rose, soft blush, serif display headings), Persian typography rules, responsive layout system, shadcn/ui + Radix component usage, tasteful motion, and an accessibility bar. Use when designing or refining any storefront/admin UI, building a new section, or making something look professional.
---

# ui-ux-pro-max 🌷

Design like a senior product designer who owns the کایا (Kaya) luxury-florist brand.
Every screen should feel calm, premium, and unmistakably Persian. Restraint over
flash. Whitespace is a feature. Below is the design system — apply it, don't reinvent it.

## 1. Brand & color (use the HSL tokens — never hard-code hex)

Defined in `src/app/globals.css`. Style with the Tailwind token classes, not raw colors:

| Role | Token class | HSL | Feel |
|---|---|---|---|
| Background | `bg-background` | `30 33% 99%` | warm white |
| Text | `text-foreground` | `340 10% 15%` | warm near-black |
| Primary | `bg-primary` / `text-primary` | `345 45% 47%` | muted rose |
| On primary | `text-primary-foreground` | white | |
| Secondary | `bg-secondary` | `345 30% 96%` | soft blush |
| Accent | `bg-accent` | `345 38% 94%` | blush accent |
| Muted | `bg-muted` / `text-muted-foreground` | warm grey | quiet text |
| Border | `border-border` | `30 12% 90%` | hairline |
| Focus ring | `ring-ring` | rose | |

Radius token: `--radius: 0.625rem` → use `rounded-lg`. Hairline borders: `border border-border/60`.

**Do**: layer blush/secondary tints for depth (`bg-secondary/40`), keep primary for
accents/CTAs/prices, let warm white breathe.
**Don't**: introduce new brand colors, use pure black/`#000`, or saturate the palette.

## 2. Persian / RTL typography (non-negotiable)

- Font: **Vazirmatn** (loaded as `--font-sans`), Tahoma → system fallback. Headings `h1`–`h4` use `font-serif`.
- **No `uppercase`, no `tracking-*`** on Persian text — it disconnects joined letterforms.
  (See `.eyebrow` in globals.css: weight + color only.)
- Numerals: Persian digits everywhere user-facing — `formatPrice()` (prices, adds تومان),
  `toPersianDigits()` (counts), `formatDate()` (Jalali dates). All from `@/lib/utils`.
- Numeric **inputs** get `dir="ltr"` (digits read LTR even on an RTL page).
- Logical CSS only: `ms/me`, `ps/pe`, `start/end`, `border-s/e`, `text-start/end`, `rounded-s/e`.
- Comfortable line-height for Persian: `leading-snug`/`leading-relaxed`; avoid cramped text.

## 3. Layout & rhythm

- Container: `.section` (`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8`) for every full-width band.
- Mobile-first. Breakpoints: `sm` (640), `lg` (1024). Grids: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` for product grids.
- Vertical rhythm: section padding `py-12`/`py-16`; intra-group gaps via `space-y-*`/`gap-*`. Be generous.
- Media: products use `aspect-[4/5]`. Always set responsive `sizes` on `fill` images.
- An eyebrow + serif heading + muted subtitle is the canonical section header (`SectionHeading`).

## 4. Components — reuse, compose, stay consistent

Build from `@/components/ui/*` (shadcn **new-york** on Radix): Button, Card, Badge, Input,
Label, Select, Dialog, Dropdown-menu, Sheet, Skeleton, Table, Textarea, Toast. Don't hand-roll
what already exists. Icons: `lucide-react`.

Signature treatments (match the existing look):
- Cards/links: `group block overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow hover:shadow-md`.
- Image hover: `object-cover transition-transform duration-500 group-hover:scale-105`.
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.
- Badges for status: `ویژه` (featured, default), `ناموجود` (sold out, `variant="secondary"`).
- Prices: `text-sm font-semibold text-primary` via `formatPrice()`.
- Overlay chips: `absolute start-3 top-3` (logical, not `left-3`).

## 5. Motion — tasteful, not flashy

- Use `transition`/`duration-300`/`duration-500` for hover (shadow, transform).
- `tailwindcss-animate` provides `accordion` + `fade-in` keyframes — use `animate-fade-in` for entering content.
- Respect intent: subtle scale (`scale-105`), gentle shadow lift. No bouncing, no long/parallax effects.
- Honor reduced motion where it matters; never block content on animation.

## 6. Accessibility bar (must pass)

- Visible focus ring on every interactive element (`focus-visible:ring-ring`).
- Real `alt` on content images; `alt=""` only for decorative.
- Icon-only buttons/links → `aria-label`.
- Every form control has a `<Label>` (htmlFor / wrapping).
- Color is never the only signal (pair with text/icon).
- Contrast ≥ AA — verify `muted-foreground` text stays legible on tinted backgrounds.
- Semantic HTML: real `<button>`/`<a>`/headings; wrap whole cards in one link for a large hit target.

## 7. The "done" checklist — run before declaring UI finished

```
[ ] On-brand color (tokens only, no raw hex, primary reserved for accents/CTA/price)
[ ] Serif headings; no uppercase/tracking on Persian; Persian numerals via utils
[ ] Logical CSS throughout; numeric inputs dir="ltr"
[ ] .section container; mobile-first; generous whitespace; aspect-[4/5] media + sizes
[ ] Built from @/components/ui/* + lucide; cn() for classes
[ ] Hover/focus states present and consistent; motion subtle
[ ] a11y: focus rings, alt, aria-labels, labels, AA contrast
[ ] next/image (never <img>); DTOs (never Prisma rows) at client boundary
[ ] npm run typecheck green
```

## 8. Do / Don't (anchored in product-card.tsx)

✅ DO
```tsx
<div className="absolute start-3 top-3 flex gap-2">
  {product.featured && <Badge>ویژه</Badge>}
</div>
<p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
```
❌ DON'T
```tsx
<div className="absolute left-3 top-3">           {/* physical → breaks RTL */}
  <span className="uppercase tracking-wide">ویژه</span>  {/* breaks Persian letterforms */}
</div>
<p style={{ color: "#b03a52" }}>{product.price} تومان</p>  {/* raw hex + Latin digits */}
```

## Workflow when invoked
1. Clarify the surface (which page/section, desired feel) only if ambiguous.
2. Propose the layout briefly, then implement using the system above — prefer editing/composing existing components.
3. Run the §7 checklist + `npm run typecheck`. Offer to launch the app (`/run`) or `/rtl-audit` to verify.
