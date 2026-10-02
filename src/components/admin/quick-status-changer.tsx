"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";
import { LEAD_STATUSES } from "@/components/admin/nav-config";

export function QuickStatusChanger({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  function onStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    setStatus(newStatus);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/leads/${leadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data?.error || "Failed");
        toast.success(`Status changed to ${newStatus}`);
        router.refresh();
      } catch {
        toast.error("Failed to update status");
        setStatus(currentStatus); // revert
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Zap className="h-3.5 w-3.5 text-teal" />
        Quick status
      </span>
      <Select value={status} onValueChange={onStatusChange} disabled={pending}>
        <SelectTrigger className="h-8 w-[160px] text-xs">
          {pending ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" /> Updating...
            </span>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
