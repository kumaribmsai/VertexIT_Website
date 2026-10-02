"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Send, MessageSquare } from "lucide-react";

type Note = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export function LeadNotes({
  leadId,
  notes,
  currentUserName,
  currentUserId,
}: {
  leadId: string;
  notes: Note[];
  currentUserName: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");

  function addNote() {
    if (!body.trim()) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data?.error || "Failed to add note");
        return;
      }
      toast.success("Note added");
      setBody("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-navy">
        <MessageSquare className="h-4 w-4 text-teal" /> Notes
      </h2>
      <div className="mb-4 space-y-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Add a note about this lead..."
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            onClick={addNote}
            disabled={pending || !body.trim()}
            size="sm"
            className="bg-teal text-white hover:bg-teal/90"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" /> Add note
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-navy">{n.authorName}</span>
                <span className="text-[0.7rem] text-muted-foreground">
                  {format(new Date(n.createdAt), "d MMM, h:mm a")}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{n.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
