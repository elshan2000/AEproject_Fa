---
name: frontend-review
description: Review the current git diff strictly against کایا's frontend conventions — RTL/logical-CSS, Persian number/date formatting, Server vs Client boundary correctness, DTO-not-Prisma-row at the client boundary, next/image usage, theme-token usage, and accessibility. A focused complement to the general-purpose /code-review. Use after making frontend changes.
---

# frontend-review

A focused review of frontend changes against **this project's** conventions.
This complements — does not replace — the built-in general `/code-review`
(which covers correctness bugs broadly). Use both when appropriate.

## Target
```bash
git diff main...HEAD -- 'src/**/*.tsx' 'src/**/*.ts' 'src/**/*.css'
git diff -- 'src/**/*.tsx'   # uncommitted changes too
```
Review only frontend files (components, app routes, globals.css, lib/utils, validations).

## Review checklist

### RTL / Persian (highest priority — this is a Persian RTL app)
- [ ] Logical CSS only — no `ml/mr`, `pl/pr`, `left/right`, `border-l/r`, `text-left/right`.
- [ ] Prices via `formatPrice()`, counts via `toPersianDigits()`, dates via `formatDate()` (all from `@/lib/utils`). No raw Latin digits in user-facing text.
- [ ] Numeric inputs (price/stock/phone/slug) have `dir="ltr"`.
- [ ] No `uppercase`/`tracking-*` on Persian text.
- [ ] Validation messages are in Persian.

### Server / Client boundary
- [ ] `"use client"` present only where state/effects/handlers are actually used — not blanket-applied.
- [ ] No Prisma `Decimal`/`Date` leaking to Client Components — props use serializable DTOs from `@/types` (Decimal→number, Date→ISO string). Raw Prisma rows must go through `services/mappers.ts`.
- [ ] `force-dynamic` retained where the page needs live data (shop layout, admin dashboard).
- [ ] On dynamic detail routes, `notFound()` is called in **both** `generateMetadata()` and the page body (per CLAUDE.md soft-404 gotcha).

### Images & theme
- [ ] `next/image` (not `<img>`), with `sizes` on `fill` images and meaningful `alt`.
- [ ] Colors use HSL theme tokens (`bg-background`, `text-primary`, `border-border`…) — no hard-coded hex.
- [ ] Headings use `font-serif`; sections use the `.section` helper where appropriate.

### Accessibility
- [ ] Visible `focus-visible:ring-*` on interactive elements.
- [ ] Icon-only controls have `aria-label`.
- [ ] Form inputs have associated `<Label>`.
- [ ] Sufficient contrast (muted-foreground on muted backgrounds still readable).

### Code hygiene
- [ ] `@/` aliases, not relative imports.
- [ ] `cn()` for conditional/merged classes.
- [ ] Reuses `@/components/ui/*` primitives instead of re-implementing.
- [ ] `lucide-react` for icons.

## Output
Group findings by severity. For each: `file:line`, the issue, and the concrete fix.
```
## Frontend Review

### 🔴 Must fix
- src/components/shop/x.tsx:30 — Prisma row passed to Client Component; map via mappers.ts → DTO.

### 🟡 Should fix
- src/components/shop/y.tsx:12 — `mr-4` → `me-4` (RTL).

### 🟢 Nits
- ...

### Verdict
Ship / needs changes. Suggest running `npm run typecheck` if not already green.
```
Do not auto-fix unless the user asks — report first.
