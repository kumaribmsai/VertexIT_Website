import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
          {eyebrow}
        </div>
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
