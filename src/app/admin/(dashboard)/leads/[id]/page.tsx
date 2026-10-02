import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/primitives";
import { LeadStatusUpdater } from "@/components/admin/lead-status-updater";
import { LeadNotes } from "@/components/admin/lead-notes";
import { LeadDetailActions } from "@/components/admin/lead-detail-actions";
import { LeadScoreBreakdown, NextActionCard } from "@/components/admin/lead-score-breakdown";
import { computeLeadScore, getRecommendedNextAction } from "@/lib/lead-scoring";
import { StatusBadge } from "@/components/site/status-badge";
import { format } from "date-fns";
import {
  Phone, Mail, MessageCircle, Globe, GraduationCap,
  Briefcase, Clock, User, FileText, ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = await requireAdmin("COUNSELLOR");
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, slug: true } },
      assignedCounsellor: { select: { id: true, name: true } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) notFound();

  // Build a unified activity timeline combining status changes and notes
  type Activity = {
    id: string;
    type: "status" | "note";
    timestamp: Date;
    authorName?: string | null;
    title: string;
    description?: string | null;
    fromStatus?: string | null;
    toStatus?: string;
  };
  const activities: Activity[] = [
    ...lead.statusHistory.map((h) => ({
      id: h.id,
      type: "status" as const,
      timestamp: h.createdAt,
      authorName: h.changedByName,
      title: h.toStatus,
      description: h.note,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
    })),
    ...lead.notes.map((n) => ({
      id: n.id,
      type: "note" as const,
      timestamp: n.createdAt,
      authorName: n.authorName,
      title: "Note added",
      description: n.body,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const counsellors = await db.adminUser.findMany({
    where: { isActive: true, role: { in: ["SUPER_ADMIN", "ADMIN", "COUNSELLOR"] } },
    select: { id: true, name: true, role: true },
  });

  const waHref = `https://wa.me/91${lead.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
    `Hi ${lead.fullName}, this is ${user.name} from VertexIT following up on your enquiry.`,
  )}`;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title={lead.fullName}
        description={`Lead since ${format(new Date(lead.createdAt), "d MMM yyyy, h:mm a")}`}
        backHref="/admin/leads"
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <LeadDetailActions leadId={lead.id} phone={lead.phone} waHref={waHref} />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Lead info card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-heading text-sm font-semibold text-navy">Contact Information</h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={Phone} label="Phone" value={lead.phone} />
              <InfoRow icon={Mail} label="Email" value={lead.email ?? "—"} />
              <InfoRow
                icon={GraduationCap}
                label="Course"
                value={
                  lead.course ? (
                    <Link
                      href={`/courses/${lead.course.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-teal hover:underline"
                    >
                      {lead.course.title} <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    "General enquiry"
                  )
                }
              />
              <InfoRow icon={GraduationCap} label="Education" value={lead.education ?? "—"} />
              <InfoRow icon={Briefcase} label="Experience" value={lead.experienceLevel ?? "—"} />
              <InfoRow icon={Globe} label="Preferred mode" value={lead.preferredMode ?? "—"} />
              <InfoRow icon={User} label="Counsellor" value={lead.assignedCounsellor?.name ?? "Unassigned"} />
              <InfoRow
                icon={Clock}
                label="Last contacted"
                value={lead.lastContactedAt ? format(new Date(lead.lastContactedAt), "d MMM, h:mm a") : "Never"}
              />
            </dl>
            {lead.message && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" /> Message
                </p>
                <p className="text-sm text-slate-700">{lead.message}</p>
              </div>
            )}
          </div>

          <LeadStatusUpdater
            leadId={lead.id}
            currentStatus={lead.status}
            nextFollowUpAt={lead.nextFollowUpAt?.toISOString() ?? null}
            counsellors={counsellors}
            assignedCounsellorId={lead.assignedCounsellorId}
            currentUser={user}
          />

          <LeadNotes
            leadId={lead.id}
            notes={lead.notes.map((n) => ({
              id: n.id,
              authorName: n.authorName,
              body: n.body,
              createdAt: n.createdAt.toISOString(),
            }))}
            currentUserName={user.name}
            currentUserId={user.id}
          />

          {/* Activity timeline (status changes + notes combined) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-heading text-sm font-semibold text-navy">Activity Timeline</h2>
            {activities.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No activity yet. Update the lead status or add a note to start the timeline.</p>
            ) : (
              <ol className="relative space-y-3 border-l-2 border-slate-100 pl-5">
                {activities.map((a) => (
                  <li key={`${a.type}-${a.id}`} className="relative">
                    {/* Timeline dot with type-based color */}
                    <span className={`absolute -left-[26px] top-2 h-3 w-3 rounded-full border-2 border-white ${
                      a.type === "status" ? "bg-teal" : "bg-navy"
                    } shadow-[0_0_0_2px_rgba(14,158,142,0.15)]`} />
                    <div className="flex items-center gap-2">
                      {a.type === "status" ? (
                        <>
                          <StatusBadge status={a.toStatus || ""} />
                          {a.fromStatus && (
                            <span className="text-xs text-slate-400">from {a.fromStatus}</span>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-navy/5 px-2 py-0.5 text-xs font-semibold text-navy">
                          <FileText className="h-3 w-3" /> Note
                        </span>
                      )}
                    </div>
                    {a.description && (
                      <p className="mt-1.5 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                        {a.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(a.timestamp), "d MMM yyyy, h:mm a")}
                      {a.authorName && ` · by ${a.authorName}`}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Recommended next action */}
          <NextActionCard {...getRecommendedNextAction(lead.status, computeLeadScore(lead))} />

          {/* Lead score breakdown */}
          <LeadScoreBreakdown lead={lead} />

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-heading text-sm font-semibold text-navy">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal text-sm font-semibold text-white hover:bg-teal/90"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-navy/15 text-sm font-semibold text-navy hover:border-teal hover:text-teal"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-heading text-sm font-semibold text-navy">Tracking</h2>
            <dl className="space-y-2 text-xs">
              <TrackRow label="Source" value={lead.utmSource} />
              <TrackRow label="Medium" value={lead.utmMedium} />
              <TrackRow label="Campaign" value={lead.utmCampaign} />
              <TrackRow label="Term" value={lead.utmTerm} />
              <TrackRow label="Content" value={lead.utmContent} />
              <TrackRow label="Referrer" value={lead.referrer} />
              <TrackRow label="Landing page" value={lead.landingPage} />
              <TrackRow label="User agent" value={lead.userAgent} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-sm text-navy break-words">{value}</dd>
      </div>
    </div>
  );
}

function TrackRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-slate-50 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-mono text-[0.7rem] text-slate-600 break-all">
        {value ?? "—"}
      </span>
    </div>
  );
}
