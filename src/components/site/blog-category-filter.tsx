"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type BlogCategoryItem = { id: string; name: string; slug: string };

export function BlogCategoryFilter({
  categories,
  activeSlug,
}: {
  categories: BlogCategoryItem[];
  activeSlug?: string;
}) {
  const base =
    "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/blog"
        scroll={false}
        className={cn(
          base,
          !activeSlug
            ? "bg-navy text-white"
            : "border border-slate-200 bg-white text-slate-700 hover:border-teal/40 hover:text-teal",
        )}
      >
        All
      </Link>
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/blog?category=${encodeURIComponent(cat.slug)}`}
            scroll={false}
            className={cn(
              base,
              isActive
                ? "bg-navy text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-teal/40 hover:text-teal",
            )}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
