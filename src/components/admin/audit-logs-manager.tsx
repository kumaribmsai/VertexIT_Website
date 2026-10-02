"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type Log = {
  id: string;
  userId: string | null;
  userName: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  metadata: string | null;
  createdAt: string;
};

export function AuditLogsManager() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(async (targetPage: number, actionFilter?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(targetPage));
      if (actionFilter) params.set("action", actionFilter);
      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error("Failed");
      setLogs(json.logs);
      setTotal(json.total);
      setPage(json.page);
      setTotalPages(json.totalPages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPage(1, action);
  }, [action, fetchPage]);

  return (
    <div>
      <AdminPageHeader
        title="Audit Logs"
        description="Read-only history of admin actions across the CMS."
        actions={
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Filter by action…"
              className="h-8 pl-8"
            />
          </div>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : logs.length === 0 ? (
          <div className="p-5">
            <AdminEmpty message="No audit logs found." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Entity</TableHead>
                <TableHead className="hidden lg:table-cell">Entity ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-sm text-slate-600">
                    {format(new Date(log.createdAt), "d MMM yyyy, h:mm a")}
                  </TableCell>
                  <TableCell className="font-medium text-navy">{log.userName || "—"}</TableCell>
                  <TableCell>
                    <AdminBadge tone="navy">{log.action}</AdminBadge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">{log.entity || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-slate-500 font-mono truncate max-w-[200px]">
                    {log.entityId || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span>
          {total > 0 ? (
            <>
              Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total}
            </>
          ) : (
            "No results"
          )}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => fetchPage(page - 1, action)}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="px-2 text-xs text-slate-500">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => fetchPage(page + 1, action)}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
