import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Allow optimized remote images (e.g. admin-uploaded URLs / CDNs).
    // Tighten these to your real image host in production.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    // We serve our own placeholder SVGs from /public; safe to allow.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    // Server Actions are enabled by default in Next 15; keep body limit sane
    // for image-related payloads.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
