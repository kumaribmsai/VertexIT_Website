"use client";

import { useCompare } from "./compare-context";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

export function CompareButton({
  courseId,
  className,
}: {
  courseId: string;
  className?: string;
}) {
  const { has, toggle } = useCompare();
  const selected = has(courseId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(courseId);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
        selected
          ? "bg-teal text-white"
          : "border border-slate-200 bg-white text-navy hover:border-teal hover:text-teal",
        className,
      )}
      aria-pressed={selected}
    >
      {selected ? (
        <>
          <Check className="h-3.5 w-3.5" /> Added
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" /> Compare
        </>
      )}
    </button>
  );
}
