import Image from "next/image";

/**
 * Product image gallery. The schema stores a single `imageUrl`, so this renders
 * one hero image in a clean editorial frame; it's structured so additional
 * images could be slotted in as thumbnails later.
 */
export function ProductGallery({
  imageUrl,
  alt,
}: {
  imageUrl: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden border border-border bg-muted">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}
