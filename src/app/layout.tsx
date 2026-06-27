import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import { Toaster } from "@/components/ui/toaster";

// Vazirmatn — the de-facto standard Persian (Farsi) web font. Covers Arabic
// (Persian) and Latin glyphs, so it serves both headings and body text.
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_NAME = "کایا";
const SITE_DESCRIPTION =
  "دسته‌گل‌ها و آرایش‌های گل لوکس، با ظرافت دست‌چین و آماده می‌شوند. گل تازه برای هر مناسبت.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${SITE_NAME} — گل و دسته‌گل لوکس`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "گل",
    "گل‌فروشی",
    "دسته‌گل",
    "سفارش گل",
    "گل لوکس",
    "گل عروسی",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fa_IR",
    title: `${SITE_NAME} — گل و دسته‌گل لوکس`,
    description: SITE_DESCRIPTION,
    url: env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — گل و دسته‌گل لوکس`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme: set the `dark` class before paint, based on a saved
            preference or the OS setting. Mirrored by ThemeToggle + localStorage. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
