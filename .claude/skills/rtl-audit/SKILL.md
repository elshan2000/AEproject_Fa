---
name: rtl-audit
description: Audit frontend files for کایا's Persian/RTL conventions — flags physical (left/right) CSS that should be logical (start/end), raw Latin digits that should use toPersianDigits/formatPrice, numeric inputs missing dir="ltr", letter-spacing/uppercase on Persian text, <img> instead of next/image, and missing alt text. Read-only report. Use when reviewing or before shipping UI changes.
---

# rtl-audit

Read-only audit of frontend files against the کایا (Kaya) Persian/RTL conventions.
**Never edit files** — produce a grouped checklist of findings with `file:line` refs.

## Scope

Default target = files changed in the current branch:
```bash
git diff --name-only main...HEAD -- 'src/**/*.tsx' 'src/**/*.ts' 'src/**/*.css'
git diff --name-only -- 'src/**/*.tsx'   # also include unstaged/uncommitted
```
If the user names specific files/dirs, audit those instead. If nothing changed,
audit `src/components/` and `src/app/`.

## What to flag

Grep each target file and report violations under these headings.

### 1. Physical → logical CSS (RTL correctness)
Persian is RTL — physical directions break the mirror. Flag and suggest the logical swap:
| Physical (flag) | Logical (suggest) |
|---|---|
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `inset-l/r`, `float-left/right` | logical equivalents |

Regex hint: `\b(m[lr]|p[lr]|border-[lr]|rounded-[lr]|left|right|text-(left|right))-?`
(exclude false positives like `right` inside words, `overflow`, and `translate` axis names).

### 2. Persian number/date formatting
- User-facing Latin digits in JSX text → should use `toPersianDigits()` (counts) or `formatPrice()` (prices) or `formatDate()` (dates) from `@/lib/utils`.
- Hard-coded "تومان" next to a number → should be `formatPrice(value)`.
- `new Date().toLocaleString()` without `fa-IR` → use `formatDate()`.

### 3. Numeric inputs
- `<Input type="number">` / price / stock / phone / slug inputs **missing `dir="ltr"`** — digits must render LTR even on the RTL page.

### 4. Persian typography
- `uppercase` or `tracking-*` applied to elements containing Persian text — breaks joined letterforms (see `.eyebrow` in `globals.css` which deliberately avoids them).

### 5. Images
- `<img ...>` instead of `next/image` `<Image>`.
- `<Image fill ...>` **missing a `sizes` prop**.
- Any `<Image>` **missing meaningful `alt`** (or `alt=""` on a content image).

### 6. Accessibility quick-checks
- Interactive elements missing `focus-visible:ring-*`.
- Icon-only buttons/links missing `aria-label`.

## Output format

```
## RTL Audit — <N> files scanned

### ✅ Clean
- src/components/shop/product-card.tsx — uses start-3, formatPrice, sizes, alt ✓

### ⚠️ Findings
#### Physical → logical CSS
- src/components/shop/foo.tsx:42 — `ml-4` → `ms-4`

#### Persian formatting
- src/components/shop/bar.tsx:19 — `{product.price} تومان` → `formatPrice(product.price)`

…

### Summary
- 3 logical-CSS, 1 formatting, 0 image issues. No edits made.
```

## Reference (already-compliant examples)
- `src/components/shop/product-card.tsx` — `start-3`, `formatPrice`, `sizes`, `fill`, `focus-visible:ring-ring`.
- `src/app/globals.css` — `.eyebrow` avoids tracking/uppercase on purpose.
- `src/lib/utils.ts` — `formatPrice`, `toPersianDigits`, `formatDate`.
