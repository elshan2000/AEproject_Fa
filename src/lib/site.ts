/** Central place for brand + contact details used across the storefront. */
export const siteConfig = {
  name: "کایا",
  tagline: "گل و دسته‌گل لوکس",
  description:
    "دسته‌گل‌ها و آرایش‌های گل لوکس، با ظرافت دست‌چین و آماده می‌شوند.",
  // Contact details (also used by the WhatsApp button & contact page).
  phone: "۰۲۱-۹۱۰۰ ۲۲۰۰",
  phoneE164: "982191002200", // digits only, for tel: & wa.me links
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

export type NavItem = (typeof siteConfig.nav)[number];
