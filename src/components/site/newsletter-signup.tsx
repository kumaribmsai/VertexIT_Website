"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterSignup({
  source = "blog",
  className,
  variant = "card",
}: {
  source?: string;
  className?: string;
  variant?: "card" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Subscription failed");
      }
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("We couldn't subscribe you right now. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={cn(
        "rounded-2xl border border-teal/30 bg-teal/5 p-6 text-center",
        variant === "card" && "shadow-sm",
        className,
      )}>
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 text-teal">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="mt-3 font-heading text-lg font-bold text-navy">You're subscribed!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you for subscribing. You'll receive IT career insights and updates from VertexIT.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={onSubmit} className={cn("flex flex-col gap-2 sm:flex-row", className)}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-11 flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="h-11 bg-teal text-white hover:bg-teal/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Subscribe
        </Button>
        {error && <p className="text-xs text-red-600 sm:absolute sm:mt-12">{error}</p>}
      </form>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold text-navy">Get IT career insights</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribe to receive practical articles on IT careers, interview tips, and industry updates. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="h-11 flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading} className="h-11 bg-teal text-white hover:bg-teal/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Subscribe
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-3 text-[0.7rem] text-muted-foreground">
        By subscribing, you agree to receive emails from VertexIT. We never share your details.
      </p>
    </div>
  );
}
