/**
 * Centralized remote (Unsplash) demo imagery for the editorial redesign.
 *
 * These are PLACEHOLDERS for the launch look — swap them for your own
 * photography later by editing only this file. `next.config.ts` already allows
 * remote https images. If any URL 404s, replace that single id.
 */
const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const demoImages = {
  // Editorial hero — a figure holding a peony bouquet, light backdrop.
  //
  // 👉 TO USE YOUR EXACT MOCKUP PHOTO: save it to
  //    public/images/hero/hero.jpg  and replace the line below with:
  //        hero: "/images/hero/hero.jpg",
  //    (a light background keeps the dark "01·02·03" / "2024" overlays readable)
  // hero: u("photo-1487070183336-b863922373d4", 1500),
  hero: "/images/hero/hero.png",
  // Dark florals for the About band.
  about: u("photo-1518895949257-7621c3c786d7", 1600),
};

/**
 * Curated collection-tile images (Signature / Romantic / Minimal / Luxury).
 *
 * 👉 LOCAL IMAGES: drop your four photos in  public/images/collections/
 *    named exactly as below (signature/romantic/minimal/luxury .png).
 *    To use a different name/format, just edit the matching path.
 */
export const collectionImages = {
  signature: "/images/collections/signature.png",
  romantic: "/images/collections/romantic.png",
  minimal: "/images/collections/minimal.png",
  luxury: "/images/collections/luxury.png",
};
