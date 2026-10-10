"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Clock, Search, Phone, Mail, MessageSquare, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  fullName: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["WAITING", "CONTACTED", "ENROLLED", "CLOSED"];

const STATUS_STYLES: Record<string, string> = {
  WAITING: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  ENROLLED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-100 text-slate-500",
};

export function WaitlistManager({ entries }: { entries: Entry[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      (e.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function updateStatus(id: string, status: string) {
    setPendingId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/waitlist/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed");
        toast.success("Status updated");
        router.refresh();
      } catch {
        toast.error("Failed to update status");
      } finally {
        setPendingId(null);
      }
    });
  }

  function convertToLead(entry: Entry) {
    if (!confirm(`Convert ${entry.fullName} to a lead? This creates a new lead in the pipeline.`)) return;
    setPendingId(entry.id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/waitlist/${entry.id}/convert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed");
        toast.success("Converted to lead");
        router.refresh();
      } catch {
        toast.error("Failed to convert to lead");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
          <Clock className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-muted-foreground">
            {entries.length === 0
              ? "No waitlist entries yet. Candidates who join a course waitlist will appear here."
              : "No entries match your filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Candidate</th>
                  <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">Course</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy/5 font-heading text-sm font-bold text-navy">
                          {e.fullName.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-navy">{e.fullName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-0.5"><Phone className="h-3 w-3" /> {e.phone}</span>
                            {e.email && <span className="inline-flex items-center gap-0.5"><Mail className="h-3 w-3" /> {e.email}</span>}
                          </div>
                          {e.message && (
                            <p className="mt-0.5 flex items-start gap-1 text-xs text-slate-500">
                              <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" /> {e.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="text-xs text-slate-600">{e.courseTitle}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={e.status}
                        onValueChange={(v) => updateStatus(e.id, v)}
                        disabled={pendingId === e.id}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      <div className="flex items-center gap-2">
                        {pendingId === e.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : null}
                        {format(new Date(e.createdAt), "d MMM yyyy")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {e.status === "WAITING" && (
                        <button
                          onClick={() => convertToLead(e)}
                          disabled={pendingId === e.id}
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-teal px-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
                          title="Convert to lead"
                        >
                          <UserPlus className="h-3.5 w-3.5" /> Convert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
