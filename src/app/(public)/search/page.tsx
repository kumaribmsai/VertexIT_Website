import type { Metadata } from "next";
import { db } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SearchBox } from "@/components/site/search-box";
import { EmptyState } from "@/components/site/state";
import { Reveal } from "@/components/site/reveal";
import Link from "next/link";
import { GraduationCap, FileText, Briefcase, HelpCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...(await buildPageMetadata({
    title: "Search",
    description: "Search VertexIT courses, blog posts, job openings and FAQs.",
    path: "/search",
    noIndex: true,
  })),
};

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let results = { courses: [] as any[], posts: [] as any[], jobs: [] as any[], faqs: [] as any[] };
  let total = 0;

  if (query.length >= 2) {
    const [courses, posts, jobs, faqs] = await Promise.all([
      db.course.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query } },
            { shortDescription: { contains: query } },
            { keySkills: { contains: query } },
            { careerPathways: { contains: query } },
          ],
        },
        select: { id: true, title: true, slug: true, shortDescription: true, trainingMode: true },
        take: 10,
      }),
      db.blogPost.findMany({
        where: {
          isPublished: true,
          OR: [{ title: { contains: query } }, { excerpt: { contains: query } }, { tags: { contains: query } }],
        },
        select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, category: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: 10,
      }),
      db.job.findMany({
        where: {
          isPublished: true,
          isExpired: false,
          OR: [{ title: { contains: query } }, { location: { contains: query } }, { skills: { contains: query } }],
        },
        select: { id: true, title: true, slug: true, location: true, workMode: true, postedDate: true },
        orderBy: { postedDate: "desc" },
        take: 10,
      }),
      db.faq.findMany({
        where: {
          isPublished: true,
          OR: [{ question: { contains: query } }, { answer: { contains: query } }],
        },
        select: { id: true, question: true, answer: true, category: true },
        take: 10,
      }),
    ]);
    results = { courses, posts, jobs, faqs };
    total = courses.length + posts.length + jobs.length + faqs.length;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "VertexIT", url: "/", potentialAction: { "@type": "SearchAction", target: "/search?q={query}", "query-input": "required name=query" } }),
        }}
      />
      <section className="bg-gradient-to-b from-slate-50/80 to-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <h1 className="mt-4 font-heading text-3xl font-bold text-navy sm:text-4xl">
            Search VertexIT
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Find courses, blog articles, job openings and FAQs — all in one place.
          </p>
          <div className="mt-6">
            <SearchBox initialValue={query} autoFocus />
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {!query || query.length < 2 ? (
            <EmptyState
              title="Start typing to search"
              description="Search across courses, blog posts, jobs and FAQs. Try “underwriting”, “Australia”, “interview” or “Bengaluru”."
            />
          ) : total === 0 ? (
            <EmptyState
              title={`No results for “${query}”`}
              description="Try a different keyword, or browse our courses and blog directly."
            />
          ) : (
            <div className="space-y-8">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-navy">{total}</span> result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>

              {results.courses.length > 0 && (
                <ResultSection icon={GraduationCap} label="Courses" count={results.courses.length}>
                  {results.courses.map((c) => (
                    <ResultRow key={c.id} href={`/courses/${c.slug}`} title={c.title} subtitle={c.shortDescription} badge={c.trainingMode} />
                  ))}
                </ResultSection>
              )}

              {results.posts.length > 0 && (
                <ResultSection icon={FileText} label="Blog" count={results.posts.length}>
                  {results.posts.map((p) => (
                    <ResultRow
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      title={p.title}
                      subtitle={p.excerpt}
                      badge={p.category?.name}
                      meta={p.publishedAt ? format(new Date(p.publishedAt), "d MMM yyyy") : undefined}
                    />
                  ))}
                </ResultSection>
              )}

              {results.jobs.length > 0 && (
                <ResultSection icon={Briefcase} label="Jobs" count={results.jobs.length}>
                  {results.jobs.map((j) => (
                    <ResultRow key={j.id} href={`/jobs/${j.slug}`} title={j.title} subtitle={`${j.location} · ${j.workMode}`} />
                  ))}
                </ResultSection>
              )}

              {results.faqs.length > 0 && (
                <ResultSection icon={HelpCircle} label="FAQs" count={results.faqs.length}>
                  {results.faqs.map((f) => (
                    <ResultRow key={f.id} href="/faq" title={f.question} subtitle={f.answer} badge={f.category} />
                  ))}
                </ResultSection>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ResultSection({ icon: Icon, label, count, children }: { icon: React.ComponentType<{ className?: string }>; label: string; count: number; children: React.ReactNode }) {
  return (
    <Reveal>
      <div>
        <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
          <Icon className="h-4 w-4 text-teal" />
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-navy">{label}</h2>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    </Reveal>
  );
}

function ResultRow({ href, title, subtitle, badge, meta }: { href: string; title: string; subtitle: string; badge?: string | null; meta?: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-teal/40 hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-heading text-sm font-bold text-navy line-clamp-1">{title}</p>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-teal" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{subtitle}</p>
        <div className="mt-2 flex items-center gap-2">
          {badge && <span className="rounded bg-teal/8 px-1.5 py-0.5 text-[0.65rem] font-semibold text-teal">{badge}</span>}
          {meta && <span className="text-[0.65rem] text-slate-400">{meta}</span>}
        </div>
      </div>
    </Link>
  );
}
