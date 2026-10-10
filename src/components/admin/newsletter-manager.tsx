"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Mail, Search, Trash2, UserCheck, UserX, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  source: string;
  isActive: boolean;
  createdAt: string;
};

export function NewsletterManager({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleActive(id: string, currentActive: boolean) {
    setPendingId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/newsletter/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentActive }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed");
        toast.success(currentActive ? "Subscriber deactivated" : "Subscriber reactivated");
        router.refresh();
      } catch {
        toast.error("Failed to update subscriber");
      } finally {
        setPendingId(null);
      }
    });
  }

  function deleteSubscriber(id: string) {
    if (!confirm("Delete this subscriber permanently?")) return;
    setPendingId(id);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed");
        toast.success("Subscriber deleted");
        router.refresh();
      } catch {
        toast.error("Failed to delete subscriber");
      } finally {
        setPendingId(null);
      }
    });
  }

  function exportCsv() {
    const headers = ["Email", "Name", "Source", "Status", "Subscribed At"];
    const rows = subscribers.map((s) => [
      s.email,
      s.name || "",
      s.source,
      s.isActive ? "Active" : "Inactive",
      format(new Date(s.createdAt), "yyyy-MM-dd HH:mm:ss"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Search + Export */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <Button onClick={exportCsv} variant="outline" size="sm" className="h-9">
          Export CSV
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
          <Mail className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-muted-foreground">
            {subscribers.length === 0
              ? "No newsletter subscribers yet. Subscribers will appear here when users sign up via the blog or footer."
              : "No subscribers match your search."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">Source</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="hidden px-4 py-3 text-left font-semibold lg:table-cell">Subscribed</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal/10 text-teal">
                          <Mail className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-navy">{s.email}</p>
                          {s.name && <p className="text-xs text-muted-foreground">{s.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {s.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        s.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
                      )}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      {format(new Date(s.createdAt), "d MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(s.id, s.isActive)}
                          disabled={pendingId === s.id}
                          className={cn(
                            "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                            s.isActive
                              ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                              : "text-slate-400 hover:bg-green-50 hover:text-green-600",
                          )}
                          title={s.isActive ? "Deactivate" : "Reactivate"}
                        >
                          {pendingId === s.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : s.isActive ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(s.id)}
                          disabled={pendingId === s.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
