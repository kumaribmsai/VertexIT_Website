"use client";

import Link from "next/link";
import { format } from "date-fns";
import { StatusBadge } from "@/components/site/status-badge";
import { Phone, Mail, ArrowRight, Calendar, Flame } from "lucide-react";

type LeadRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  status: string;
  score: number;
  createdAt: string | Date;
  nextFollowUpAt: string | Date | null;
  lastContactedAt: string | Date | null;
  course: { id: string; title: string } | null;
  assignedCounsellor: { id: string; name: string } | null;
};

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 70
      ? "bg-red-100 text-red-700 border-red-200"
      : score >= 40
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-bold ${tone}`}
      title={`Lead score: ${score}/100`}
    >
      {score >= 70 && <Flame className="h-3 w-3" />}
      {score}
    </span>
  );
}

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">No leads found. Adjust your filters or wait for new enquiries.</p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Lead</th>
              <th className="hidden px-4 py-3 text-left font-semibold md:table-cell">Course</th>
              <th className="px-4 py-3 text-left font-semibold">Score</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">Counsellor</th>
              <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">Next Follow-up</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="group hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 font-heading text-sm font-bold text-navy">
                      {lead.fullName.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-navy hover:text-teal">
                        {lead.fullName}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {lead.phone}
                        {lead.email && (
                          <>
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{lead.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {lead.course ? (
                    <span className="text-xs text-slate-600">{lead.course.title}</span>
                  ) : (
                    <span className="text-xs text-slate-400">General</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ScoreBadge score={lead.score} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {lead.assignedCounsellor ? (
                    <span className="text-xs text-slate-600">{lead.assignedCounsellor.name}</span>
                  ) : (
                    <span className="text-xs text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {lead.nextFollowUpAt ? (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(lead.nextFollowUpAt), "d MMM, h:mm a")}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {format(new Date(lead.createdAt), "d MMM yyyy")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-teal/10 hover:text-teal"
                    aria-label="View lead"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
