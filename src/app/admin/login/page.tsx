"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { LinkButton } from "@/components/site/buttons";
import { Loader2, Lock, Mail, AlertCircle, MessageCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const error = search.get("error");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    error === "disabled" ? "Your account has been disabled. Please contact a super admin." : null,
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setServerError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (!res || res.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-navy">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@vertexit.in"
            className="h-11 pl-10"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-navy">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 pl-10"
          />
        </div>
      </div>

      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-navy text-white hover:bg-navy-light"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1">
        {/* Left brand panel */}
        <div className="relative hidden w-1/2 flex-col justify-between bg-navy p-12 text-white lg:flex">
          <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
          <div className="relative">
            <Logo className="[&_span]:text-white" />
          </div>
          <div className="relative">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              Admin Console
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight">
              Manage leads, courses,<br />jobs &amp; content.
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-300">
              The VertexIT admin panel gives your team full control over the training and placement platform —
              lead pipeline, course CMS, job management, blog, trainers and site settings.
            </p>
          </div>
          <div className="relative text-xs text-slate-400">© {new Date().getFullYear()} VertexIT · LEARN • APPLY</div>
        </div>

        {/* Right form panel */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
          <div className="w-full max-w-sm">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="mt-8 lg:mt-0">
              <h1 className="font-heading text-2xl font-bold text-navy">Sign in to admin</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter your admin credentials to continue.</p>

              <Suspense fallback={<div className="mt-6 h-48 animate-pulse rounded-lg bg-slate-100" />}>
                <LoginForm />
              </Suspense>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-navy">Demo credentials</p>
                <p className="mt-1">Email: <code className="rounded bg-white px-1.5 py-0.5">admin@vertexit.in</code></p>
                <p>Password: <code className="rounded bg-white px-1.5 py-0.5">vertexit123</code></p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <LinkButton href="/" variant="ghost" size="sm">← Back to site</LinkButton>
                <a
                  href="https://wa.me/919703686514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-teal hover:text-teal/80"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Need help?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
