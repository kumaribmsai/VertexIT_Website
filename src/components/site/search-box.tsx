"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, GraduationCap, FileText, Briefcase, HelpCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type Result = {
  ok: boolean;
  total: number;
  results: {
    courses: { id: string; title: string; slug: string; shortDescription: string; trainingMode: string }[];
    posts: { id: string; title: string; slug: string; excerpt: string; publishedAt: string | null; category: { name: string } | null }[];
    jobs: { id: string; title: string; slug: string; location: string; workMode: string; postedDate: string }[];
    faqs: { id: string; question: string; answer: string; category: string }[];
  };
};

export function SearchBox({ initialValue = "", autoFocus = false }: { initialValue?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(initialValue);
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!q || q.length < 2) {
      setData(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setData(json);
        setOpen(true);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={onSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Search courses, blog, jobs, FAQs..."
          className="h-14 rounded-full border-slate-200 bg-white pl-12 pr-12 text-base shadow-sm"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-teal" />
        )}
        {q && !loading && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setData(null);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Live dropdown */}
      {open && data && data.total > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {data.results.courses.length > 0 && (
            <ResultGroup icon={GraduationCap} label="Courses">
              {data.results.courses.map((c) => (
                <ResultItem key={c.id} href={`/courses/${c.slug}`} title={c.title} subtitle={c.shortDescription} badge={c.trainingMode} onClick={() => setOpen(false)} />
              ))}
            </ResultGroup>
          )}
          {data.results.posts.length > 0 && (
            <ResultGroup icon={FileText} label="Blog">
              {data.results.posts.map((p) => (
                <ResultItem key={p.id} href={`/blog/${p.slug}`} title={p.title} subtitle={p.excerpt} badge={p.category?.name} onClick={() => setOpen(false)} />
              ))}
            </ResultGroup>
          )}
          {data.results.jobs.length > 0 && (
            <ResultGroup icon={Briefcase} label="Jobs">
              {data.results.jobs.map((j) => (
                <ResultItem key={j.id} href={`/jobs/${j.slug}`} title={j.title} subtitle={`${j.location} · ${j.workMode}`} onClick={() => setOpen(false)} />
              ))}
            </ResultGroup>
          )}
          {data.results.faqs.length > 0 && (
            <ResultGroup icon={HelpCircle} label="FAQs">
              {data.results.faqs.map((f) => (
                <ResultItem key={f.id} href="/faq" title={f.question} subtitle={f.answer} badge={f.category} onClick={() => setOpen(false)} />
              ))}
            </ResultGroup>
          )}
          <div className="border-t border-slate-100 p-2">
            <button
              onClick={onSubmit}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-teal hover:bg-teal/5"
            >
              See all results for &ldquo;{q}&rdquo; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultGroup({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-1.5 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      {children}
    </div>
  );
}

function ResultItem({ href, title, subtitle, badge, onClick }: { href: string; title: string; subtitle: string; badge?: string | null; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 transition-colors hover:bg-teal/5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy line-clamp-1">{title}</p>
        {badge && (
          <span className="shrink-0 rounded bg-teal/8 px-1.5 py-0.5 text-[0.65rem] font-semibold text-teal">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
    </Link>
  );
}
