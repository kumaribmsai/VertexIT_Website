import Link from "next/link";
import { Compass, Home, Briefcase, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy px-4 py-16 text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />

      <div className="relative w-full max-w-xl text-center">
        <div className="flex justify-center [&_span]:text-white [&_.text-muted-foreground]:text-teal-soft">
          <Logo />
        </div>

        <p className="mt-10 font-heading text-[7rem] font-extrabold leading-none tracking-tight text-teal sm:text-[9rem]">
          404
        </p>

        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Looks like this page moved.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          The page you were looking for doesn&apos;t exist or may have been moved. Try one of the
          options below to get back on track.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/courses"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal px-6 text-sm font-semibold text-white transition-colors hover:bg-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Compass className="h-4 w-4" /> Explore Courses
          </Link>
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:border-teal hover:text-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Briefcase className="h-4 w-4" /> View Jobs
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Home className="h-4 w-4" /> Go Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          Need help? WhatsApp us at{" "}
          <a
            href="https://wa.me/919703686514"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal-soft hover:text-white"
          >
            +91 97036 86514
          </a>
          .
        </p>
      </div>
    </main>
  );
}
