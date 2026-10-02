import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { LeadFilters } from "@/components/admin/lead-filters";
import { LeadsTable } from "@/components/admin/leads-table";
import { LEAD_STATUSES } from "@/components/admin/nav-config";
import { computeLeadScore, getScoreTone } from "@/lib/lead-scoring";
import { Flame, TrendingUp, Minus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { user } = await requireAdmin("COUNSELLOR");
  const params = await searchParams;

  const status = params.status;
  const course = params.course;
  const scoreFilter = params.score; // "hot" | "warm" | "cold"
  const q = params.q?.trim();
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 20;

  const where = {
    ...(status ? { status } : {}),
    ...(course ? { courseId: course } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, leadsRaw, courses] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        course: { select: { id: true, title: true } },
        assignedCounsellor: { select: { id: true, name: true } },
      },
    }),
    db.course.findMany({ select: { id: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  // Compute lead scores for prioritisation and apply score filter
  const allLeadsWithScores = leadsRaw.map((l) => ({
    id: l.id,
    fullName: l.fullName,
    phone: l.phone,
    email: l.email,
    status: l.status,
    score: computeLeadScore(l),
    createdAt: l.createdAt,
    nextFollowUpAt: l.nextFollowUpAt,
    lastContactedAt: l.lastContactedAt,
    course: l.course,
    assignedCounsellor: l.assignedCounsellor,
  }));

  // Filter by score tone if requested
  const leads = scoreFilter
    ? allLeadsWithScores.filter((l) => getScoreTone(l.score) === scoreFilter)
    : allLeadsWithScores;

  // Count leads by score tone (across all filtered leads, not just current page)
  const scoreCounts = {
    hot: allLeadsWithScores.filter((l) => getScoreTone(l.score) === "hot").length,
    warm: allLeadsWithScores.filter((l) => getScoreTone(l.score) === "warm").length,
    cold: allLeadsWithScores.filter((l) => getScoreTone(l.score) === "cold").length,
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Status summary counts
  const statusCounts = await db.lead.groupBy({ by: ["status"], _count: true });

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Leads"
        description="Manage enquiries and the counselling pipeline."
        actions={
          <a
            href={`/api/admin/leads/export${status ? `?status=${encodeURIComponent(status)}` : ""}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-navy hover:border-teal hover:text-teal"
          >
            Export CSV
          </a>
        }
      />

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            !status ? "bg-navy text-white" : "bg-white border border-slate-200 text-navy hover:border-teal"
          }`}
        >
          All <span className="opacity-70">{total}</span>
        </Link>
        {LEAD_STATUSES.map((s) => {
          const count = statusCounts.find((c) => c.status === s)?._count.status ?? 0;
          if (count === 0 && status !== s) return null;
          return (
            <Link
              key={s}
              href={`/admin/leads?status=${encodeURIComponent(s)}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                status === s ? "bg-teal text-white" : "bg-white border border-slate-200 text-navy hover:border-teal"
              }`}
            >
              {s} <span className="opacity-70">{count}</span>
            </Link>
          );
        })}
      </div>

      {/* Score filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Score:</span>
        <Link
          href={`/admin/leads?${new URLSearchParams({ ...(status ? { status } : {}), ...(course ? { course } : {}), ...(q ? { q } : {}) }).toString()}`}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            !scoreFilter ? "bg-navy text-white" : "bg-white border border-slate-200 text-navy hover:border-teal"
          }`}
        >
          All <span className="opacity-70">{allLeadsWithScores.length}</span>
        </Link>
        {([
          { key: "hot", label: "Hot", count: scoreCounts.hot, icon: Flame, color: "red" },
          { key: "warm", label: "Warm", count: scoreCounts.warm, icon: TrendingUp, color: "amber" },
          { key: "cold", label: "Cold", count: scoreCounts.cold, icon: Minus, color: "slate" },
        ] as const).map((s) => {
          if (s.count === 0 && scoreFilter !== s.key) return null;
          const isActive = scoreFilter === s.key;
          const activeColor = {
            red: "bg-red-500 text-white",
            amber: "bg-amber-500 text-white",
            slate: "bg-slate-500 text-white",
          }[s.color];
          return (
            <Link
              key={s.key}
              href={`/admin/leads?${new URLSearchParams({ ...(status ? { status } : {}), ...(course ? { course } : {}), ...(q ? { q } : {}), score: s.key }).toString()}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isActive ? activeColor : "bg-white border border-slate-200 text-navy hover:border-teal"
              }`}
            >
              <s.icon className="h-3 w-3" />
              {s.label} <span className="opacity-70">{s.count}</span>
            </Link>
          );
        })}
      </div>

      <LeadFilters courses={courses} current={{ status, course, q }} />

      <LeadsTable leads={leads} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} · {total} leads
          </p>
          <div className="flex gap-1">
            {page > 1 && (
              <Link
                href={`/admin/leads?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium hover:border-teal"
              >
                Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/leads?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium hover:border-teal"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
