import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, GraduationCap, FileCheck2, Briefcase, TrendingUp } from "lucide-react";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { Reveal } from "@/components/site/reveal";
import type { getSiteSettings } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

type Settings = Awaited<ReturnType<typeof getSiteSettings>>;

const PROGRESSION = [
  { icon: GraduationCap, label: "Foundations", caption: "Industry fundamentals" },
  { icon: FileCheck2, label: "Skills", caption: "Loan file analysis, ratios, AUS" },
  { icon: Briefcase, label: "Practice", caption: "Case-study based learning" },
  { icon: TrendingUp, label: "Career", caption: "Job-ready & placement assistance" },
];

// Premium asymmetric hero — left copy block, right navy→teal gradient panel
// with dot-grid pattern, floating "LEARN • APPLY" badge, and a layered
// career-progression visual representing the journey from learn to apply.
export async function HomeHero({ settings }: { settings: Settings }) {
  const waHref = await whatsappUrl("home");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50/80">
      {/* Decorative blurred blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-72 w-72 rounded-full bg-teal/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-navy/5 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-24">
        {/* Left — copy block */}
        <div className="lg:col-span-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {settings.heroEyebrow}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem] text-balance">
              {settings.heroHeading}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg text-balance">
              {settings.heroSubheading}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton href={waHref} size="lg" className="w-full sm:w-auto">
                {settings.heroPrimaryCta}
              </WhatsAppButton>
              <LinkButton href="/courses" variant="outline" size="lg" className="w-full sm:w-auto">
                {settings.heroSecondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
                Hybrid training in Bengaluru
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
                Placement assistance
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
                Career-focused curriculum
              </span>
            </div>
          </Reveal>
        </div>

        {/* Right — gradient panel with career-progression visual + hero image */}
        <div className="lg:col-span-5">
          <Reveal delay={200} className="h-full">
            <div className="relative h-full">
              {/* The gradient panel */}
              <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-gradient p-6 shadow-[0_30px_60px_-20px_rgba(11,37,69,0.45)] sm:p-8">
                {/* Dot-grid overlay */}
                <div className="bg-dot-grid absolute inset-0 opacity-60" aria-hidden />

                {/* Hero image accent — top-right floating card */}
                <div className="absolute right-4 top-4 z-10 hidden overflow-hidden rounded-xl border border-white/20 shadow-lg sm:block">
                  <Image
                    src="/uploads/hero-career.jpg"
                    alt="Career progression visual representing the journey from learning to applying"
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                </div>

                {/* Floating LEARN • APPLY badge */}
                <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-soft" aria-hidden />
                  Learn <span className="text-teal-soft">•</span> Apply
                </div>

                {/* Inner content — career progression */}
                <div className="relative z-10 mt-10">
                  <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                    Your Career Path
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold text-white">
                    Foundations → Career
                  </p>

                  <ol className="mt-5 space-y-3">
                    {PROGRESSION.map((step, i) => (
                      <li
                        key={step.label}
                        className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition-colors hover:border-white/25"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                          <step.icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold leading-tight text-white">
                            <span className="mr-1.5 text-teal-soft">{String(i + 1).padStart(2, "0")}</span>
                            {step.label}
                          </p>
                          <p className="truncate text-[0.72rem] text-white/70">{step.caption}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  {/* Mini CTA */}
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-teal-soft/30 bg-teal/15 p-3 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-teal-soft" aria-hidden />
                      <p className="text-xs font-semibold text-white">Placement Assistance</p>
                    </div>
                    <Link
                      href="/placement-process"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-soft hover:text-white"
                    >
                      Learn more <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating accent chip — Practical Learning */}
              <div
                className="absolute -bottom-4 -left-4 z-20 hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_30px_-12px_rgba(11,37,69,0.25)] sm:block"
                aria-hidden
              >
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
                    <FileCheck2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-[0.78rem] font-bold text-navy leading-none">
                      Practical Learning
                    </p>
                    <p className="mt-1 text-[0.65rem] text-muted-foreground">Case-study based</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
