"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Phone, CheckCircle2, Loader2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM",
];

function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let added = 0;
  let cursor = 0;
  while (added < count) {
    const d = new Date(today);
    d.setDate(d.getDate() + cursor);
    // Skip Sundays (0)
    if (d.getDay() !== 0) {
      days.push(d);
      added++;
    }
    cursor++;
  }
  return days;
}

export function BookingWidget({
  courseTitle,
  source = "booking-widget",
  variant = "card",
}: {
  courseTitle?: string;
  source?: string;
  variant?: "card" | "inline";
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [message, setMessage] = useState("");

  const days = getNextDays(10);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !phone || !selectedDate || !selectedTime) {
      setError("Please fill in your name, phone, and select a slot.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          phone,
          email: email || undefined,
          message: `Counselling booking request: ${selectedDate} at ${selectedTime}.${courseTitle ? ` Course: ${courseTitle}.` : ""}${message ? ` Note: ${message}` : ""}`,
          source,
          preferredMode: "Hybrid",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Booking failed");
      setSubmitted(true);
    } catch {
      setError("We couldn't book your slot right now. Please try again or WhatsApp us at +91 97036 86514.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={cn("rounded-2xl border border-teal/30 bg-teal/5 p-6 text-center", variant === "card" && "shadow-sm")}>
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-heading text-lg font-bold text-navy">Slot requested!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We've received your counselling request for{" "}
          <span className="font-semibold text-navy">{selectedDate} at {selectedTime}</span>.
          A VertexIT counsellor will confirm your slot shortly via WhatsApp or phone.
        </p>
        <a
          href="https://wa.me/919703686514"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-teal px-5 text-sm font-semibold text-white hover:bg-teal/90"
        >
          <Phone className="h-4 w-4" /> Confirm on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6", variant === "card" && "shadow-sm")}>
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-heading text-base font-bold text-navy">Book a counselling slot</h3>
          <p className="text-xs text-muted-foreground">Pick a time that works for you</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Date picker */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-navy">
            <Calendar className="h-3.5 w-3.5 text-teal" /> Select date
          </Label>
          <div className="grid grid-cols-5 gap-1.5">
            {days.map((d) => {
              const iso = d.toISOString().slice(0, 10);
              const isSel = selectedDate === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    "flex flex-col items-center rounded-lg border px-1 py-2 text-center transition-all",
                    isSel
                      ? "border-teal bg-teal text-white"
                      : "border-slate-200 hover:border-teal/40 hover:bg-teal/5",
                  )}
                >
                  <span className="text-[0.6rem] font-medium uppercase">
                    {d.toLocaleDateString("en-IN", { weekday: "short" })}
                  </span>
                  <span className="font-heading text-sm font-bold">{d.getDate()}</span>
                  <span className="text-[0.6rem]">
                    {d.toLocaleDateString("en-IN", { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time picker */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-navy">
            <Clock className="h-3.5 w-3.5 text-teal" /> Select time
          </Label>
          <div className="grid grid-cols-4 gap-1.5">
            {TIME_SLOTS.map((t) => {
              const isSel = selectedTime === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  className={cn(
                    "rounded-lg border px-2 py-1.5 text-xs font-medium transition-all",
                    isSel
                      ? "border-teal bg-teal text-white"
                      : "border-slate-200 hover:border-teal/40 hover:bg-teal/5",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Full name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-navy">Phone *</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              inputMode="tel"
              className="h-10"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-navy">Email (optional)</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="h-10"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-teal text-white hover:bg-teal/90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Booking...
            </>
          ) : (
            <>
              <CalendarDays className="h-4 w-4" /> Request this slot
            </>
          )}
        </Button>

        <p className="text-center text-[0.65rem] text-muted-foreground">
          A counsellor will confirm your slot via WhatsApp. No payment required.
        </p>
      </form>
    </div>
  );
}
