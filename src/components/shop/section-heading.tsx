export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-start"
      }
    >
      {eyebrow && (
        <p className="mb-4 text-xs font-medium text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
