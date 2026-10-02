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
    select: { createdAt: true, utmSource: true, preferredMode: true },
  });
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
  ]);

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
