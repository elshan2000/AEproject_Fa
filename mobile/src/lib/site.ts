/** Mirrors the web app's src/lib/site.ts. */
export const siteConfig = {
  name: "کایا",
  tagline: "گل و دسته‌گل لوکس",
  description:
    "دسته‌گل‌ها و آرایش‌های گل لوکس، با ظرافت دست‌چین و آماده می‌شوند.",
  phone: "۰۲۱-۹۱۰۰ ۲۲۰۰",
  phoneE164: "982191002200",
  email: "hello@kaya.ir",
  address: "تهران، خیابان ولیعصر، کوچهٔ گلستان، پلاک ۱۲۸",
  hours: "شنبه تا پنجشنبه، ۹ تا ۱۸",
  nav: [
    { label: "خانه", href: "/" },
    { label: "فروشگاه", href: "/products" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
  ],
} as const;
