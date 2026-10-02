import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestimonialCardData = {
  id: string;
  studentName: string;
  photo: string | null;
  course: string | null;
  quote: string;
  rating: number;
};

export function TestimonialCard({ t, className }: { t: TestimonialCardData; className?: string }) {
  return (
    <figure
      className={cn(
        "relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6",
        className,
      )}
    >
      <Quote className="absolute right-5 top-5 h-8 w-8 text-teal/15" aria-hidden />
      <div className="flex items-center gap-1 text-teal">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn("h-4 w-4", i < t.rating ? "fill-teal text-teal" : "text-slate-200")}
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-slate-700">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full bg-navy/10">
          {t.photo ? (
            <Image src={t.photo} alt={t.studentName} fill sizes="40px" className="object-cover" />
          ) : (
            <span className="inline-flex h-full w-full items-center justify-center font-heading text-sm font-bold text-navy">
              {t.studentName.slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-navy">{t.studentName}</p>
          {t.course && <p className="text-xs text-muted-foreground">{t.course}</p>}
        </div>
      </figcaption>
    </figure>
  );
}
