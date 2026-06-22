import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Used by every shadcn/ui component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price in Persian digits with the Toman suffix, e.g. "۸۹٬۰۰۰ تومان". */
export function formatPrice(value: number): string {
  const formatted = new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} تومان`;
}

/** Convert a number/string to Persian digits, e.g. 12 -> "۱۲". */
export function toPersianDigits(value: number | string): string {
  // Persian digits ۰..۹ start at Unicode U+06F0.
  return String(value).replace(/\d/g, (d) =>
    String.fromCharCode(0x06f0 + Number(d))
  );
}

/**
 * Turn a product/category name into a URL-safe slug. Latin text is lowercased
 * and accent-stripped; Persian/Arabic letters (U+0600–U+06FF) are preserved so
 * Persian names produce real slugs (URL-encoded) instead of empty strings.
 * Returns "" only when the input has no slug-able characters — callers should
 * fall back (see `slugifyWithFallback`).
 *
 *   "Blush Garden Bouquet!" -> "blush-garden-bouquet"
 *   "گل آزمایشی"            -> "گل-آزمایشی"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip Latin accents (combining diacritics)
    .replace(/[^a-z0-9؀-ۿ\s-]/g, "") // keep latin + Persian/Arabic letters
    .replace(/[\s_-]+/g, "-") // collapse whitespace/underscores to a dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}

/** Like `slugify` but guarantees a non-empty result via a random fallback. */
export function slugifyWithFallback(input: string): string {
  const slug = slugify(input);
  return slug || `item-${Math.random().toString(36).slice(2, 8)}`;
}

/** Format an ISO date with the Persian (Jalali) calendar, e.g. "۱ تیر ۱۴۰۵". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
