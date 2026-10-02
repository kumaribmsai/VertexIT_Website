"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { AlertTriangle, RefreshCw, Home, MessageCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
          <Logo />
          <div className="mt-8 max-w-md">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-8 w-8" />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-bold text-navy">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We encountered an unexpected error. Our team has been notified. Please try again, or reach us on WhatsApp if the issue persists.
            </p>
            {error.digest && (
              <p className="mt-3 font-mono text-xs text-slate-400">Error ID: {error.digest}</p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={reset}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-light"
              >
                <RefreshCw className="h-4 w-4" /> Try again
              </button>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-navy/15 px-5 text-sm font-semibold text-navy hover:border-teal hover:text-teal"
              >
                <Home className="h-4 w-4" /> Go home
              </Link>
              <a
                href="https://wa.me/919703686514"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-teal px-5 text-sm font-semibold text-white hover:bg-teal/90"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
