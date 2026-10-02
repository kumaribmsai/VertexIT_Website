import { db } from "@/lib/db";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  Users, GraduationCap, Briefcase, FileText, Trophy, Star, Bell, ArrowUpRight,
  TrendingUp, Clock, Phone, Mail, Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { LeadTrendChart } from "@/components/admin/charts/lead-trend-chart";
import { SourceBreakdownChart } from "@/components/admin/charts/source-breakdown-chart";
import { LeadFunnelChart } from "@/components/admin/charts/lead-funnel-chart";
import { format, formatDistanceToNow, subDays, eachDayOfInterval } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin("CONTENT_EDITOR");

  // 14-day lead trend data
  const trendStart = subDays(new Date(), 13);
  const trendEnd = new Date();
  const allLeads = await db.lead.findMany({
    where: { createdAt: { gte: trendStart } },
    select: { createdAt: true, utmSource: true, preferredMode: true, lastContactedAt: true, status: true },
  });

  // Lead response time metric — average hours from lead creation to first contact
  // Only counts leads that have been contacted (lastContactedAt is not null)
  const contactedLeads = allLeads.filter((l) => l.lastContactedAt);
  const avgResponseHours = contactedLeads.length > 0
    ? contactedLeads.reduce((sum, l) => {
        const diff = new Date(l.lastContactedAt!).getTime() - new Date(l.createdAt).getTime();
        return sum + Math.max(0, diff / (1000 * 60 * 60));
      }, 0) / contactedLeads.length
    : 0;
  const pendingResponse = allLeads.filter((l) => l.status === "NEW" && !l.lastContactedAt).length;

  const trendDays = eachDayOfInterval({ start: trendStart, end: trendEnd });
  const leadTrend = trendDays.map((d) => {
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    const count = allLeads.filter(
      (l) => l.createdAt >= dayStart && l.createdAt <= dayEnd,
    ).length;
    return { date: format(d, "yyyy-MM-dd"), label: format(d, "d MMM"), count };
  });

  // Source breakdown (organic, direct, social, referral, other)
  const sourceColors: Record<string, string> = {
    google: "#0E9E8E",
    direct: "#0B2545",
    facebook: "#1877F2",
    instagram: "#E1306C",
    linkedin: "#0A66C2",
    whatsapp: "#25D366",
    referral: "#F59E0B",
    organic: "#0E9E8E",
  };
  const sourceCounts: Record<string, number> = {};
  for (const l of allLeads) {
    const src = (l.utmSource || l.preferredMode || "direct").toLowerCase();
    const key = src in sourceColors ? src : "other";
    sourceCounts[key] = (sourceCounts[key] || 0) + 1;
  }
  if (Object.keys(sourceCounts).length === 0) sourceCounts["direct"] = 0;
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: sourceColors[name] || "#94A3B8",
  }));

  const [
    totalLeads,
    newLeads,
    activeFollowups,
    publishedCourses,
    activeJobs,
    publishedBlogPosts,
    placementStories,
    testimonials,
    jobApplications,
    recentLeads,
    leadStatusBreakdown,
    courseEnquiryBreakdown,
    notifications,
    enrolledCount,
    placedCount,
    counsellorStats,
  ] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "NEW" } }),
    db.lead.count({ where: { status: { in: ["FOLLOW-UP REQUIRED", "INTERESTED", "COUNSELLING SCHEDULED"] } } }),
    db.course.count({ where: { isPublished: true } }),
    db.job.count({ where: { isPublished: true, isExpired: false } }),
    db.blogPost.count({ where: { isPublished: true } }),
    db.placementStory.count({ where: { isPublished: true } }),
    db.testimonial.count({ where: { isPublished: true } }),
    db.jobApplication.count(),
    db.lead.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { course: { select: { title: true } } } }),
    db.lead.groupBy({ by: ["status"], _count: true, orderBy: { _count: { status: "desc" } } }),
    db.lead.groupBy({ by: ["courseId"], _count: true, orderBy: { _count: { courseId: "desc" } }, take: 5 }),
    db.adminNotification.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    db.lead.count({ where: { status: "ENROLLED" } }),
    db.lead.count({ where: { status: "PLACED" } }),
    db.lead.groupBy({
      by: ["assignedCounsellorId"],
      _count: true,
      where: { assignedCounsellorId: { not: null } },
      orderBy: { _count: { assignedCounsellorId: "desc" } },
      take: 5,
    }),
  ]);

  // Resolve counsellor names for leaderboard
  const counsellorIds = counsellorStats.map((c) => c.assignedCounsellorId).filter(Boolean) as string[];
  const counsellors = counsellorIds.length
    ? await db.adminUser.findMany({
        where: { id: { in: counsellorIds } },
        select: { id: true, name: true, role: true },
      })
    : [];
  const counsellorMap = new Map(counsellors.map((c) => [c.id, c]));
  const leaderboard = counsellorStats
    .map((c, i) => ({
      rank: i + 1,
      name: counsellorMap.get(c.assignedCounsellorId!)?.name || "Unknown",
      role: counsellorMap.get(c.assignedCounsellorId!)?.role || "",
      count: c._count.assignedCounsellorId,
    }))
    .filter((c) => c.name !== "Unknown");

  // Conversion rate: enrolled + placed as percentage of total leads
  const conversionRate = totalLeads > 0 ? Math.round(((enrolledCount + placedCount) / totalLeads) * 100) : 0;
  const placementRate = enrolledCount > 0 ? Math.round((placedCount / enrolledCount) * 100) : 0;

  // Resolve course names for enquiry breakdown
  const courseIds = courseEnquiryBreakdown.map((c) => c.courseId).filter(Boolean) as string[];
  const courses = courseIds.length
    ? await db.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } })
    : [];
  const courseMap = new Map(courses.map((c) => [c.id, c.title]));
  const maxEnquiry = Math.max(...courseEnquiryBreakdown.map((c) => c._count.courseId), 1);

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, href: "/admin/leads", tone: "navy" },
    { label: "New Leads", value: newLeads, icon: Bell, href: "/admin/leads?status=NEW", tone: "teal" },
    { label: "Active Follow-ups", value: activeFollowups, icon: Clock, href: "/admin/leads?status=FOLLOW-UP+REQUIRED", tone: "amber" },
    { label: "Job Applications", value: jobApplications, icon: FileText, href: "/admin/leads", tone: "purple" },
    { label: "Published Courses", value: publishedCourses, icon: GraduationCap, href: "/admin/courses", tone: "navy" },
    { label: "Active Jobs", value: activeJobs, icon: Briefcase, href: "/admin/jobs", tone: "teal" },
    { label: "Blog Posts", value: publishedBlogPosts, icon: FileText, href: "/admin/blog", tone: "navy" },
    { label: "Placement Stories", value: placementStories, icon: Trophy, href: "/admin/placement-stories", tone: "teal" },
  ] as const;

  const toneClasses: Record<string, string> = {
    navy: "bg-navy/10 text-navy",
    teal: "bg-teal/10 text-teal",
    amber: "bg-amber-100 text-amber-700",
    purple: "bg-purple-100 text-purple-700",
  };

  // Build funnel data from status counts (representing the conversion pipeline)
  const statusCountMap = new Map(leadStatusBreakdown.map((r) => [r.status, r._count.status]));
  const funnelStages = [
    { stage: "New", key: "NEW", color: "#3B82F6" },
    { stage: "Contacted", key: "CONTACTED", color: "#0E9E8E" },
    { stage: "Counselled", key: "COUNSELLING COMPLETED", color: "#14B8A6" },
    { stage: "Interested", key: "INTERESTED", color: "#0B2545" },
    { stage: "Enrolled", key: "ENROLLED", color: "#F59E0B" },
    { stage: "Placed", key: "PLACED", color: "#10B981" },
  ];
  const funnelData = funnelStages.map((s) => ({
    stage: s.stage,
    label: s.stage,
    count: statusCountMap.get(s.key) || 0,
    color: s.color,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's what's happening at VertexIT today.</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>{format(new Date(), "EEEE, d MMMM yyyy")}</p>
          <p>{format(new Date(), "h:mm a")}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-teal/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[s.tone]}`}>
                <s.icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-teal" />
            </div>
            <p className="mt-3 font-heading text-2xl font-bold text-navy">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Response time metric */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg. response time</p>
              <p className="font-heading text-2xl font-bold text-navy">
                {avgResponseHours > 0
                  ? avgResponseHours < 1
                    ? `${Math.round(avgResponseHours * 60)}m`
                    : avgResponseHours < 24
                      ? `${Math.round(avgResponseHours)}h`
                      : `${Math.round(avgResponseHours / 24)}d`
                  : "—"}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {contactedLeads.length > 0
              ? `Based on ${contactedLeads.length} contacted lead${contactedLeads.length !== 1 ? "s" : ""} in the last 14 days`
              : "No leads contacted in the last 14 days yet"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${pendingResponse > 0 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"}`}>
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Awaiting response</p>
              <p className="font-heading text-2xl font-bold text-navy">{pendingResponse}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            New leads not yet contacted — prioritise these for follow-up
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Response rate</p>
              <p className="font-heading text-2xl font-bold text-navy">
                {allLeads.length > 0
                  ? `${Math.round((contactedLeads.length / allLeads.length) * 100)}%`
                  : "—"}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {contactedLeads.length} of {allLeads.length} leads contacted in the last 14 days
          </p>
        </div>
      </div>

      {/* Charts row — lead trend + source breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-sm font-semibold text-navy">Lead Trend</h2>
                <p className="text-xs text-muted-foreground">Last 14 days</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[0.7rem] font-semibold text-teal">
                <TrendingUp className="h-3.5 w-3.5" />
                {leadTrend.reduce((s, d) => s + d.count, 0)} total
              </span>
            </div>
            <LeadTrendChart data={leadTrend} />
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-heading text-sm font-semibold text-navy">Lead Sources</h2>
            <p className="mb-4 text-xs text-muted-foreground">Where enquiries come from</p>
            <SourceBreakdownChart data={sourceData} total={totalLeads} />
          </div>
        </div>
      </div>

      {/* Lead conversion funnel */}
      {funnelData.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-sm font-semibold text-navy">Conversion Funnel</h2>
              <p className="text-xs text-muted-foreground">Lead pipeline from enquiry to placement</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-2.5 py-1 text-[0.7rem] font-semibold text-navy">
              <TrendingUp className="h-3.5 w-3.5" />
              {funnelData.length} stages
            </span>
          </div>
          <LeadFunnelChart data={funnelData} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="font-heading text-sm font-semibold text-navy">Recent Enquiries</h2>
              <Link href="/admin/leads" className="text-xs font-medium text-teal hover:underline">
                View all →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 font-heading text-sm font-bold text-navy">
                        {lead.fullName.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy">{lead.fullName}</p>
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {lead.phone}
                          {lead.course?.title && (
                            <>
                              <span>·</span>
                              <span className="truncate">{lead.course.title}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={lead.status} />
                        <span className="text-[0.7rem] text-slate-400">
                          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Lead status breakdown */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-heading text-sm font-semibold text-navy">Lead Status Breakdown</h2>
            <div className="mt-4 space-y-2.5">
              {leadStatusBreakdown.length === 0 && (
                <p className="text-sm text-muted-foreground">No leads yet.</p>
              )}
              {leadStatusBreakdown.slice(0, 6).map((row) => {
                const max = Math.max(...leadStatusBreakdown.map((r) => r._count.status), 1);
                const pct = Math.round((row._count.status / max) * 100);
                return (
                  <div key={row.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <StatusBadge status={row.status} />
                      <span className="font-semibold text-navy">{row._count.status}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course enquiry breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-heading text-sm font-semibold text-navy">Course Enquiries</h2>
            <div className="mt-4 space-y-3">
              {courseEnquiryBreakdown.length === 0 && (
                <p className="text-sm text-muted-foreground">No enquiries yet.</p>
              )}
              {courseEnquiryBreakdown.map((row) => {
                const label = row.courseId ? courseMap.get(row.courseId) ?? "Unknown" : "General";
                const pct = Math.round((row._count.courseId / maxEnquiry) * 100);
                return (
                  <div key={row.courseId ?? "general"} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-navy truncate pr-2">{label}</span>
                      <span className="font-semibold text-teal">{row._count.courseId}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion rate + Top counsellors */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversion rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-navy">Conversion & Placement</h2>
          <p className="mb-4 text-xs text-muted-foreground">Lead-to-enrollment funnel</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Enrollment rate</span>
                <span className="font-bold text-navy">{conversionRate}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal transition-all duration-500" style={{ width: `${conversionRate}%` }} />
              </div>
              <p className="mt-1 text-[0.65rem] text-muted-foreground">{enrolledCount + placedCount} enrolled of {totalLeads} total leads</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Placement rate</span>
                <span className="font-bold text-navy">{placementRate}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-navy transition-all duration-500" style={{ width: `${placementRate}%` }} />
              </div>
              <p className="mt-1 text-[0.65rem] text-muted-foreground">{placedCount} placed of {enrolledCount} enrolled</p>
            </div>
          </div>
        </div>

        {/* Top counsellors leaderboard */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="font-heading text-sm font-semibold text-navy">Top Counsellors</h2>
              <span className="text-xs text-muted-foreground">By assigned leads</span>
            </div>
            {leaderboard.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">No counsellor assignments yet. Assign leads to see the leaderboard.</p>
            ) : (
              <ol className="divide-y divide-slate-100">
                {leaderboard.map((c) => (
                  <li key={c.rank} className="flex items-center gap-3 px-5 py-3">
                    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${
                      c.rank === 1 ? "bg-amber-100 text-amber-700"
                      : c.rank === 2 ? "bg-slate-100 text-slate-700"
                      : c.rank === 3 ? "bg-orange-100 text-orange-700"
                      : "bg-slate-50 text-slate-500"
                    }`}>
                      {c.rank === 1 ? "🥇" : c.rank === 2 ? "🥈" : c.rank === 3 ? "🥉" : c.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-sm font-bold text-navy">{c.count}</p>
                      <p className="text-[0.65rem] text-muted-foreground">leads</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* Recent notifications */}
      {notifications.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <h2 className="font-heading text-sm font-semibold text-navy">Recent Activity</h2>
            <Link href="/admin/notifications" className="text-xs font-medium text-teal hover:underline">
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Bell className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
                <span className="text-[0.7rem] text-slate-400">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
