import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { NewsletterManager } from "@/components/admin/newsletter-manager";
import { NewsletterGrowthChart } from "@/components/admin/charts/newsletter-growth-chart";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { Mail, Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  await requireAdmin("CONTENT_EDITOR");

  const [subscribers, totalActive, totalAll, allSubscribersForChart] = await Promise.all([
    db.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.newsletterSubscriber.count({ where: { isActive: true } }),
    db.newsletterSubscriber.count(),
    db.newsletterSubscriber.findMany({
      where: { createdAt: { gte: subDays(new Date(), 29) } },
      select: { createdAt: true },
    }),
  ]);

  // Build 30-day growth chart data
  const chartStart = subDays(new Date(), 29);
  const chartEnd = new Date();
  const chartDays = eachDayOfInterval({ start: chartStart, end: chartEnd });
  const growthData = chartDays.map((d) => {
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    const newSignups = allSubscribersForChart.filter(
      (s) => {
        const dayStart = new Date(d);
        dayStart.setHours(0, 0, 0, 0);
        return s.createdAt >= dayStart && s.createdAt <= dayEnd;
      },
    ).length;
    const total = allSubscribersForChart.filter(
      (s) => s.createdAt <= dayEnd,
    ).length + (totalAll - allSubscribersForChart.length); // add pre-chart total
    return { date: format(d, "yyyy-MM-dd"), label: format(d, "d MMM"), total, newSignups };
  });

  const serialized = subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    name: s.name,
    source: s.source,
    isActive: s.isActive,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Newsletter Subscribers"
        description="Manage email subscribers from blog, footer, and resources signups."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="font-heading text-2xl font-bold text-navy">{totalActive}</p>
              <p className="text-xs text-muted-foreground">Active subscribers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <p className="font-heading text-2xl font-bold text-navy">{totalAll}</p>
              <p className="text-xs text-muted-foreground">Total signups</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <p className="font-heading text-2xl font-bold text-navy">
                {totalAll > 0 ? Math.round((totalActive / totalAll) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Retention rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-sm font-semibold text-navy">Subscriber Growth</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[0.7rem] font-semibold text-teal">
            <TrendingUp className="h-3.5 w-3.5" />
            {growthData.reduce((s, d) => s + d.newSignups, 0)} new in 30 days
          </span>
        </div>
        <NewsletterGrowthChart data={growthData} />
      </div>

      <NewsletterManager subscribers={serialized} />
    </div>
  );
}
