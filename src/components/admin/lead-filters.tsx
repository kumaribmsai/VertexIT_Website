"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export function LeadFilters({
  courses,
  current,
}: {
  courses: { id: string; title: string }[];
  current: { status?: string; course?: string; q?: string };
}) {
  const router = useRouter();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function buildUrl(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    if (current.status) params.set("status", current.status);
    if (updates.q !== undefined) {
      if (updates.q) params.set("q", updates.q);
    } else if (current.q) {
      params.set("q", current.q);
    }
    if (updates.course !== undefined) {
      if (updates.course) params.set("course", updates.course);
    } else if (current.course) {
      params.set("course", current.course);
    }
    return `/admin/leads?${params.toString()}`;
  }

  function onSearch(value: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      router.push(buildUrl({ q: value }));
    }, 350);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search name, phone or email..."
          defaultValue={current.q ?? ""}
          onChange={(e) => onSearch(e.target.value)}
          className="h-9 pl-9"
        />
      </div>
      <Select
        value={current.course ?? "all"}
        onValueChange={(v) => router.push(buildUrl({ course: v === "all" ? "" : v }))}
      >
        <SelectTrigger className="h-9 w-[200px]">
          <SelectValue placeholder="All courses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All courses</SelectItem>
          {courses.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(current.q || current.course) && (
        <button
          onClick={() => router.push(buildUrl({ q: "", course: "" }))}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-500 hover:text-navy"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      )}
    </div>
  );
}
