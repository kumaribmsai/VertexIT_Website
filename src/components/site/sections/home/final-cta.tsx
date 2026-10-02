import { MessageCircle, UserRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { whatsappUrl } from "@/lib/whatsapp";
import type { getSiteSettings } from "@/lib/site";

type Settings = Awaited<ReturnType<typeof getSiteSettings>>;

export async function FinalCta({ settings }: { settings: Settings }) {
  const waHref = await whatsappUrl("home").catch(() => "#");

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-gradient px-6 py-12 text-center shadow-[0_30px_60px_-20px_rgba(11,37,69,0.45)] sm:px-12 sm:py-16 lg:py-20">
            {/* Dot grid overlay */}
            <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            {/* Decorative glows */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-navy-light/40 blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-soft" aria-hidden />
                Learn <span className="text-teal-soft">•</span> Apply
              </span>

              <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] text-balance">
                {settings.finalCtaHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-lg text-balance">
                {settings.finalCtaSubheading}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-teal px-7 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-soft focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp Us
                </a>
                <Link
                  href="/apply"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-md transition-all hover:border-white/60 hover:bg-white/10 sm:w-auto"
                >
                  <UserRound className="h-4 w-4" aria-hidden />
                  Talk to a Counsellor
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>

              <p className="mt-6 text-xs text-slate-300">
                {settings.businessHours && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-teal-soft" aria-hidden />
                    Business hours: {settings.businessHours}
                  </span>
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
