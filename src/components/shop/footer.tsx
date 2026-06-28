import Link from "next/link";

const LINKS = [
  { en: "CUSTOM ORDER", href: "/contact" },
  { en: "CONTACT", href: "/contact" },
  { en: "SHIPPING & RETURNS", href: "/about" },
  { en: "TERMS & CONDITIONS", href: "/about" },
];

// Minimal luxury footer: links (left) · wordmark (center) · social (right),
// with a centered copyright bar beneath.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="section grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-3">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
          {LINKS.map((l) => (
            <li key={l.en}>
              <Link
                href={l.href}
                className="font-latin text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-opacity hover:opacity-60"
              >
                {l.en}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className="text-center leading-none" aria-label="KAYA">
          <span className="block font-display text-2xl font-semibold tracking-[0.3em] text-foreground">
            KAYA
          </span>
          <span className="mt-1 block font-latin text-[9px] uppercase tracking-[0.5em] text-muted-foreground">
            Floral Studio
          </span>
        </Link>

        <div className="flex items-center justify-center gap-6 md:justify-end">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="font-latin text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-opacity hover:opacity-60"
          >
            Instagram
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            className="font-latin text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-opacity hover:opacity-60"
          >
            Pinterest
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="section py-5 text-center font-latin text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          © {year} Kaya Floral Studio. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
