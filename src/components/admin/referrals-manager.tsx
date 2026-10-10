"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { UserPlus, Search, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Referral = {
  id: string;
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string | null;
  friendName: string;
  friendPhone: string;
  friendEmail: string | null;
  courseTitle: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-teal/10 text-teal",
  CONTACTED: "bg-blue-100 text-blue-700",
  CONVERTED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-100 text-slate-500",
};

export function ReferralsManager({ referrals }: { referrals: Referral[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = referrals.filter((r) => {
    const matchesSearch =
      r.referrerName.toLowerCase().includes(search.toLowerCase()) ||
      r.friendName.toLowerCase().includes(search.toLowerCase()) ||
      r.referrerPhone.includes(search) ||
      r.friendPhone.includes(search);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function updateStatus(id: string, status: string) {
    setPendingId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/referrals/${id}`, {
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search referrer or friend..."
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
          <UserPlus className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-muted-foreground">
            {referrals.length === 0
              ? "No referrals yet. When someone refers a friend via /refer, it will appear here."
              : "No referrals match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-teal/40"
            >
              {/* Referrer → Friend */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 font-heading text-sm font-bold text-teal">
                    {r.referrerName.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">{r.referrerName}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {r.referrerPhone}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy/10 font-heading text-sm font-bold text-navy">
                    {r.friendName.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy">{r.friendName}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {r.friendPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              {(r.courseTitle || r.message) && (
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
                  {r.courseTitle && (
                    <p className="text-xs text-slate-500">Course interest: <span className="font-medium text-navy">{r.courseTitle}</span></p>
                  )}
                  {r.message && (
                    <p className="text-xs text-slate-500">{r.message}</p>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(r.createdAt), "d MMM yyyy")}
                </span>
                <Select
                  value={r.status}
                  onValueChange={(v) => updateStatus(r.id, v)}
                  disabled={pendingId === r.id}
                >
                  <SelectTrigger className="h-7 w-[120px] text-xs">
                    {pendingId === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <SelectValue />}
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
