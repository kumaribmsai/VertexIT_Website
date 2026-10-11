import type { Metadata } from "next";
import { db } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { LinkButton } from "@/components/site/buttons";
import { EmptyState } from "@/components/site/state";
import Link from "next/link";
import { ArrowLeft, Check, GraduationCap, Clock, Layers, Briefcase, Award, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = await buildPageMetadata({
  title: "Compare Courses",
  description: "Compare VertexIT training programs side by side — curriculum, duration, mode, career pathways and more.",
  path: "/courses/compare",
});

function splitList(input?: string | null): string[] {
  if (!input) return [];
  return input.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsParam } = await searchParams;
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : [];

  const courses = ids.length > 0
    ? await db.course.findMany({
        where: { id: { in: ids }, isPublished: true },
        include: {
          modules: { orderBy: { sortOrder: "asc" } },
          outcomes: { orderBy: { sortOrder: "asc" } },
        },
      })
    : [];

  // Sort courses to match the order of ids
  courses.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50/80 to-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Compare" }]} />
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Compare programs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            See how our training programs compare side by side — curriculum, mode, career pathways and more.
          </p>
        </div>
      </section>

      <section className="bg-white pb-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {courses.length < 2 ? (
            <EmptyState
              title="Select at least 2 courses to compare"
              description="Browse our courses and click 'Compare' on the ones you want to compare. You can compare up to 3 courses at once."
              action={
                <LinkButton href="/courses" variant="navy">
                  Browse courses
                </LinkButton>
              }
            />
          ) : (
            <ComparisonTable courses={courses} />
          )}
        </div>
      </section>
    </>
  );
}

type CourseForCompare = Awaited<ReturnType<typeof db.course.findMany>>[number] & {
  modules: { id: string; title: string; description: string; sortOrder: number }[];
  outcomes: { id: string; text: string; sortOrder: number }[];
};

function ComparisonTable({ courses }: { courses: CourseForCompare[] }) {
  const rows: { label: string; icon: React.ComponentType<{ className?: string }>; render: (c: CourseForCompare) => React.ReactNode }[] = [
    {
      label: "Training mode",
      icon: Layers,
      render: (c) => <span className="font-semibold text-navy">{c.trainingMode}</span>,
    },
    {
      label: "Duration",
      icon: Clock,
      render: (c) => <span className="text-navy">{c.duration || "To be confirmed"}</span>,
    },
    {
      label: "Eligibility",
      icon: GraduationCap,
      render: (c) => <span className="text-sm text-slate-600">{c.eligibility || "Any graduate"}</span>,
    },
    {
      label: "Status",
      icon: Award,
      render: (c) => <span className="inline-flex items-center rounded-md bg-teal/8 px-2 py-0.5 text-xs font-semibold text-teal">{c.status}</span>,
    },
    {
      label: "Short description",
      icon: BookOpen,
      render: (c) => <p className="text-sm text-slate-600">{c.shortDescription}</p>,
    },
    {
      label: "Who it's for",
      icon: GraduationCap,
      render: (c) => <p className="text-sm text-slate-600">{c.whoFor || "—"}</p>,
    },
    {
      label: "What you'll learn",
      icon: BookOpen,
      render: (c) => <p className="text-sm text-slate-600">{c.whatYouLearn || "—"}</p>,
    },
    {
      label: "Practical learning",
      icon: Layers,
      render: (c) => <p className="text-sm text-slate-600">{c.practicalLearning || "—"}</p>,
    },
    {
      label: "Career roles",
      icon: Briefcase,
      render: (c) => (
        <ul className="space-y-1">
          {splitList(c.careerPathways).map((r) => (
            <li key={r} className="flex items-start gap-1.5 text-sm text-slate-600">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              {r}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Key skills",
      icon: Award,
      render: (c) => (
        <div className="flex flex-wrap gap-1.5">
          {splitList(c.keySkills).map((s) => (
            <span key={s} className="inline-flex items-center rounded-md bg-teal/8 px-2 py-0.5 text-[0.7rem] font-medium text-teal">
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Modules count",
      icon: Layers,
      render: (c) => <span className="font-heading text-2xl font-bold text-navy">{c.modules.length}</span>,
    },
    {
      label: "Placement assistance",
      icon: Briefcase,
      render: (c) => <p className="text-sm text-slate-600">{c.placementAssistance || "Included"}</p>,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      {/* Header row */}
      <div className="grid bg-navy text-white" style={{ gridTemplateColumns: `200px repeat(${courses.length}, 1fr)` }}>
        <div className="px-4 py-5 sm:px-6">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
            Compare
          </span>
          <p className="mt-1 font-heading text-sm font-bold">Program details</p>
        </div>
        {courses.map((c, i) => (
          <div key={c.id} className="border-l border-white/10 px-4 py-5 sm:px-6">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              Program {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 font-heading text-sm font-bold leading-tight">{c.title}</p>
            <Link
              href={`/courses/${c.slug}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-soft hover:text-white"
            >
              View details →
            </Link>
          </div>
        ))}
      </div>

      {/* Body rows */}
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}
          style={{ gridTemplateColumns: `200px repeat(${courses.length}, 1fr)` }}
        >
          <div className="flex items-center gap-2 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6">
            <row.icon className="h-3.5 w-3.5 text-teal" />
            {row.label}
          </div>
          {courses.map((c) => (
            <div key={c.id} className="border-l border-slate-100 px-4 py-4 sm:px-6">
              {row.render(c)}
            </div>
          ))}
        </div>
      ))}

      {/* CTA row */}
      <div className="grid bg-white" style={{ gridTemplateColumns: `200px repeat(${courses.length}, 1fr)` }}>
        <div className="px-4 py-4 sm:px-6">
          <span className="text-xs font-semibold text-muted-foreground">Actions</span>
        </div>
        {courses.map((c) => (
          <div key={c.id} className="border-l border-slate-100 px-4 py-4 sm:px-6">
            <Link
              href={`/courses/${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-light"
            >
              View course <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
