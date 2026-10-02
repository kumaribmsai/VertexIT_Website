"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, Calendar, UserCog } from "lucide-react";
import { LEAD_STATUSES } from "@/components/admin/nav-config";

type Counsellor = { id: string; name: string; role: string };
type CurrentUser = { id: string; name: string; email: string; role: string };

export function LeadStatusUpdater({
  leadId,
  currentStatus,
  nextFollowUpAt,
  counsellors,
  assignedCounsellorId,
  currentUser,
}: {
  leadId: string;
  currentStatus: string;
  nextFollowUpAt: string | null;
  counsellors: Counsellor[];
  assignedCounsellorId: string | null;
  currentUser: CurrentUser;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const [counsellorId, setCounsellorId] = useState(assignedCounsellorId ?? "");
  const [followUp, setFollowUp] = useState(
    nextFollowUpAt ? new Date(nextFollowUpAt).toISOString().slice(0, 16) : "",
  );
  const [note, setNote] = useState("");

  function save() {
    startTransition(async () => {
      const body: Record<string, unknown> = {};
      if (status !== currentStatus) body.status = status;
      if (counsellorId !== (assignedCounsellorId ?? "")) body.assignedCounsellorId = counsellorId || null;
      if (followUp !== (nextFollowUpAt ? new Date(nextFollowUpAt).toISOString().slice(0, 16) : "")) {
        body.nextFollowUpAt = followUp ? new Date(followUp).toISOString() : null;
      }
      if (note) body.note = note;

      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data?.error || "Failed to update lead");
        return;
      }
      toast.success("Lead updated");
      setNote("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 font-heading text-sm font-semibold text-navy">Update Lead</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-navy">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-navy">Assigned counsellor</Label>
          <Select value={counsellorId || "unassigned"} onValueChange={(v) => setCounsellorId(v === "unassigned" ? "" : v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {counsellors.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-navy">Next follow-up</Label>
          <Input
            type="datetime-local"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-navy">Note (optional)</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Add a note about this status change..."
            className="resize-none"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={save}
          disabled={pending}
          className="h-9 bg-navy text-white hover:bg-navy-light"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save changes
            </>
          )}
        </Button>
      </div>
      {(currentUser.id !== assignedCounsellorId) && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserCog className="h-3.5 w-3.5" /> You are {currentUser.name}
        </p>
      )}
    </div>
  );
}
