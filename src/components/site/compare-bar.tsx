"use client";

import { useCompare } from "./compare-context";
import { X, GitCompare, ArrowRight } from "lucide-react";
import Link from "next/link";

export type CompareCourseMini = {
  id: string;
  title: string;
  slug: string;
};

export function CompareBar({ courses }: { courses: CompareCourseMini[] }) {
  const { ids, remove, clear } = useCompare();
  const selected = courses.filter((c) => ids.includes(c.id));

  if (selected.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_-12px_rgba(11,37,69,0.15)] backdrop-blur lg:bottom-0" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
            <GitCompare className="h-4 w-4" />
          </span>
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold text-navy">Compare courses</p>
            <p className="text-[0.7rem] text-muted-foreground">{selected.length} of 3 selected</p>
          </div>
        </div>

        {/* Selected course chips */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {selected.map((c) => (
            <span
              key={c.id}
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-1.5 text-xs"
            >
              <span className="font-medium text-navy line-clamp-1 max-w-[140px]">{c.title}</span>
              <button
                onClick={() => remove(c.id)}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-navy"
                aria-label={`Remove ${c.title}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {Array.from({ length: 3 - selected.length }).map((_, i) => (
            <span
              key={i}
              className="hidden sm:inline-flex h-7 items-center rounded-full border border-dashed border-slate-300 px-3 text-[0.7rem] text-slate-400"
            >
              Add course
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="hidden h-9 items-center rounded-lg px-3 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-navy sm:inline-flex"
          >
            Clear all
          </button>
          <Link
            href={`/courses/compare?ids=${selected.map((c) => c.id).join(",")}`}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
              selected.length >= 2
                ? "bg-teal text-white hover:bg-teal/90"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            aria-disabled={selected.length < 2}
            onClick={(e) => {
              if (selected.length < 2) e.preventDefault();
            }}
          >
            Compare <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
