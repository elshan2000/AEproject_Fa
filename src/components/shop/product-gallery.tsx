import Image from "next/image";

/**
 * Product image gallery. The schema stores a single `imageUrl`, so this renders
 * one hero image in an elegant frame; it's structured so additional images
 * could be slotted in as thumbnails later without changing the detail page.
 */
export function ProductGallery({
  imageUrl,
  alt,
}: {
  imageUrl: string;
  alt: string;
}) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-secondary/40">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
