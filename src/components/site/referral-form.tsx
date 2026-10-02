"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, UserPlus, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReferralForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!referrerName || !referrerPhone || !friendName || !friendPhone) {
      setError("Please fill in your details and your friend's details.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerName, referrerPhone, friendName, friendPhone, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Referral failed");
      setSubmitted(true);
    } catch {
      setError("We couldn't submit your referral right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={cn("rounded-2xl border border-teal/30 bg-teal/5 p-6 text-center", className)}>
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-teal">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="mt-3 font-heading text-lg font-bold text-navy">Thank you for referring!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We've received your referral. Our team will reach out to your friend. If they enroll, you'll hear from us with a thank-you.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <UserPlus className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold text-navy">Refer a friend</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Know someone who would benefit from VertexIT training? Refer them and we'll follow up.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your details
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Your name *</Label>
            <Input value={referrerName} onChange={(e) => setReferrerName(e.target.value)} placeholder="Your name" className="h-10" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Your phone *</Label>
            <Input value={referrerPhone} onChange={(e) => setReferrerPhone(e.target.value)} placeholder="10-digit mobile" inputMode="tel" className="h-10" />
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your friend's details
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Friend's name *</Label>
            <Input value={friendName} onChange={(e) => setFriendName(e.target.value)} placeholder="Friend's name" className="h-10" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Friend's phone *</Label>
            <Input value={friendPhone} onChange={(e) => setFriendPhone(e.target.value)} placeholder="10-digit mobile" inputMode="tel" className="h-10" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium text-navy">Message (optional)</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Anything we should know..." className="resize-none" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="h-11 w-full bg-teal text-white hover:bg-teal/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit Referral
        </Button>
      </form>
    </div>
  );
}
