import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { AdminEmpty } from "@/components/admin/primitives";
import Link from "next/link";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { CalendarDays, Clock, Phone, MessageCircle, ExternalLink, Users } from "lucide-react";

export const dynamic = "force-dynamic";

// Booking requests are stored as leads with "Counselling booking request:" in the message.
// We parse the message to extract the date, time and course.
function parseBookingMessage(message: string): { date: string; time: string; course: string } | null {
  // Expected format: "Counselling booking request: YYYY-MM-DD at HH:MM AM/PM. Course: X. Note: Y"
  const match = message.match(
    /Counselling booking request:\s*(\d{4}-\d{2}-\d{2})\s*at\s*([\d:]+\s*[AP]M)/i,
  );
  if (!match) return null;
  const courseMatch = message.match(/Course:\s*([^.]+)/i);
  return {
    date: match[1],
    time: match[2],
    course: courseMatch?.[1]?.trim() || "General",
  };
}

export default async function AdminCalendarPage() {
  const { user } = await requireAdmin("COUNSELLOR");

  // Fetch leads that look like booking requests
  const allBookingLeads = await db.lead.findMany({
    where: {
      message: { contains: "Counselling booking request" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true, slug: true } },
      assignedCounsellor: { select: { name: true } },
    },
    take: 200,
  });

  // Parse bookings
  const bookings = allBookingLeads
    .map((l) => {
      const parsed = parseBookingMessage(l.message ?? "");
      if (!parsed) return null;
      const slotDateTime = parseISO(`${parsed.date}T${parsed.time.replace(/(\d+):(\d+)\s*(AM|PM)/i, (_, h, m, ap) => {
        let hr = parseInt(h);
        if (ap.toUpperCase() === "PM" && hr !== 12) hr += 12;
        if (ap.toUpperCase() === "AM" && hr === 12) hr = 0;
        return `${String(hr).padStart(2, "0")}:${m}`;
      })}`);
      return { lead: l, ...parsed, slotDateTime };
    })
    .filter((b): b is NonNullable<typeof b> => b !== null)
    .sort((a, b) => a.slotDateTime.getTime() - b.slotDateTime.getTime());

  // Split into upcoming and past
  const now = new Date();
  const upcoming = bookings.filter((b) => b.slotDateTime >= now);
  const past = bookings.filter((b) => b.slotDateTime < now);

  // Group upcoming by date
  const upcomingByDate = upcoming.reduce((acc, b) => {
    const dateKey = format(b.slotDateTime, "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(b);
    return acc;
  }, {} as Record<string, typeof upcoming>);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Counselling Calendar"
        description="Booked counselling sessions from the website booking widget."
        actions={
          <Link
            href="/admin/leads"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-navy hover:border-teal hover:text-teal"
          >
            View all leads →
          </Link>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard label="Total bookings" value={bookings.length} icon={CalendarDays} tone="navy" />
        <SummaryCard label="Upcoming" value={upcoming.length} icon={Clock} tone="teal" />
        <SummaryCard label="Today" value={upcoming.filter((b) => isToday(b.slotDateTime)).length} icon={Users} tone="amber" />
        <SummaryCard label="Completed" value={past.length} icon={Users} tone="slate" />
      </div>

      {/* Upcoming bookings */}
      <div>
        <h2 className="mb-3 font-heading text-sm font-semibold text-navy">Upcoming sessions</h2>
        {upcoming.length === 0 ? (
          <AdminEmpty message="No upcoming counselling sessions booked. Share the /book page link with candidates." />
        ) : (
          <div className="space-y-4">
            {Object.entries(upcomingByDate).map(([dateKey, dayBookings]) => {
              const date = parseISO(dateKey);
              const isToday_ = isToday(date);
              const isTomorrow_ = isTomorrow(date);
              const dayLabel = isToday_
                ? "Today"
                : isTomorrow_
                  ? "Tomorrow"
                  : format(date, "EEEE, d MMM yyyy");
              return (
                <div key={dateKey} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-teal" />
                      <span className="font-heading text-sm font-bold text-navy">{dayLabel}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{dayBookings.length} session{dayBookings.length !== 1 ? "s" : ""}</span>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {dayBookings.map((b) => (
                      <li key={b.lead.id}>
                        <Link
                          href={`/admin/leads/${b.lead.id}`}
                          className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex w-16 shrink-0 flex-col items-center rounded-lg bg-navy/5 py-1.5">
                            <span className="font-heading text-sm font-bold text-navy">{b.time.split(":")[0]}:{b.time.split(":")[1]?.split(" ")[0]}</span>
                            <span className="text-[0.65rem] text-muted-foreground">{b.time.match(/(AM|PM)/i)?.[0]}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-navy">{b.lead.fullName}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {b.lead.phone}</span>
                              {b.course && <span>· {b.course}</span>}
                              {b.lead.assignedCounsellor && (
                                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {b.lead.assignedCounsellor.name}</span>
                              )}
                            </div>
                          </div>
                          <StatusBadgeForLead status={b.lead.status} />
                          <ExternalLink className="h-4 w-4 text-slate-300" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past bookings */}
      {past.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-sm font-semibold text-navy">Past sessions</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {past.slice(0, 20).map((b) => (
                <li key={b.lead.id}>
                  <Link
                    href={`/admin/leads/${b.lead.id}`}
                    className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                  >
                    <span className="inline-flex w-16 shrink-0 justify-center text-xs text-slate-400">
                      {format(b.slotDateTime, "d MMM")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy">{b.lead.fullName}</p>
                      <p className="text-xs text-muted-foreground">{b.time} · {b.course}</p>
                    </div>
                    <StatusBadgeForLead status={b.lead.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "navy" | "teal" | "amber" | "slate";
}) {
  const tones = {
    navy: "bg-navy/10 text-navy",
    teal: "bg-teal/10 text-teal",
    amber: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 font-heading text-2xl font-bold text-navy">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function StatusBadgeForLead({ status }: { status: string }) {
  const tone =
    status === "NEW" ? "bg-blue-100 text-blue-700"
    : status === "PLACED" || status === "ENROLLED" ? "bg-green-100 text-green-700"
    : status === "NOT INTERESTED" || status === "CLOSED" ? "bg-slate-100 text-slate-500"
    : "bg-teal/10 text-teal";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${tone}`}>
      {status}
    </span>
  );
}
