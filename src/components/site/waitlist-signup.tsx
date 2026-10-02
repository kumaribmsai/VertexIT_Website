"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Users, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function WaitlistSignup({
  courseId,
  courseTitle,
  className,
}: {
  courseId: string;
  courseTitle: string;
  className?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName || !phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, fullName, phone, email, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Submission failed");
      setSubmitted(true);
    } catch {
      setError("We couldn't add you to the waitlist right now. Please try again or WhatsApp us.");
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
        <h3 className="mt-3 font-heading text-lg font-bold text-navy">You're on the waitlist!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll notify you when the next batch for <span className="font-semibold text-navy">{courseTitle}</span> is scheduled. Keep an eye on your WhatsApp for updates.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <Users className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold text-navy">Join the waitlist</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to know when the next batch of <span className="font-semibold text-navy">{courseTitle}</span> starts. No commitment required.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Full name *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" className="h-10" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Phone *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" inputMode="tel" className="h-10" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium text-navy">Email (optional)</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="h-10" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium text-navy">Message (optional)</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Any questions or preferences..." className="resize-none" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="h-11 w-full bg-teal text-white hover:bg-teal/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Join Waitlist
        </Button>
        <p className="text-center text-[0.7rem] text-muted-foreground">
          We'll notify you via WhatsApp when the next batch is scheduled.
        </p>
      </form>
    </div>
  );
}
