"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CarouselTestimonial = {
  id: string;
  studentName: string;
  photo: string | null;
  course: string | null;
  quote: string;
  rating: number;
};

export function TestimonialsCarousel({ testimonials }: { testimonials: CarouselTestimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = testimonials.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, count, next]);

  if (count === 0) return null;

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="w-full shrink-0 px-1">
              <figure className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                <Quote className="absolute right-8 top-8 h-12 w-12 text-teal/10" aria-hidden />
                {/* Stars */}
                <div className="flex items-center gap-1 text-teal">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-4 w-4", i < t.rating ? "fill-teal text-teal" : "text-slate-200")}
                      aria-hidden
                    />
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="mt-5 text-lg leading-relaxed text-slate-700 sm:text-xl text-balance">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                {/* Author */}
                <figcaption className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
                  <span className="relative inline-flex h-12 w-12 overflow-hidden rounded-full bg-navy/10 ring-2 ring-white">
                    {t.photo ? (
                      <Image src={t.photo} alt={t.studentName} fill sizes="48px" className="object-cover" />
                    ) : (
                      <span className="inline-flex h-full w-full items-center justify-center bg-brand-gradient text-sm font-bold text-white">
                        {t.studentName.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-navy">{t.studentName}</p>
                    {t.course && <p className="text-xs text-teal">{t.course}</p>}
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-navy shadow-sm backdrop-blur transition-all hover:border-teal hover:text-teal"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-navy shadow-sm backdrop-blur transition-all hover:border-teal hover:text-teal"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === current ? "w-8 bg-teal" : "w-2 bg-slate-300 hover:bg-slate-400",
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
