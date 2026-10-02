import {
  ClipboardList,
  GraduationCap,
  Wrench,
  FileUser,
  Users2,
  Mailbox,
  Building2,
  HeartHandshake,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { WhatsAppButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";

// 8-step placement journey. Uses the approved wording:
// "Placement assistance with a very high placement rate."
// Does NOT claim guaranteed jobs.
const STEPS = [
  {
    icon: ClipboardList,
    title: "Choose Course",
    description: "Pick the mortgage program that aligns with your career interest and background.",
  },
  {
    icon: GraduationCap,
    title: "Complete Training",
    description: "Go through the structured curriculum covering industry fundamentals and real workflows.",
  },
  {
    icon: Wrench,
    title: "Build Job-Ready Skills",
    description: "Practice on case-study based scenarios to develop practical, applied skills.",
  },
  {
    icon: FileUser,
    title: "Resume & Profile Preparation",
    description: "Get guidance on resume, LinkedIn profile and role-specific positioning.",
  },
  {
    icon: Users2,
    title: "Mock Interview Prep",
    description: "Role-specific mock interviews with feedback to refine your answers and confidence.",
  },
  {
    icon: Mailbox,
    title: "Receive Relevant Opportunities",
    description: "Get curated job opportunities aligned with your training and suitability.",
  },
  {
    icon: Building2,
    title: "Interview with Employers",
    description: "Interview with hiring teams, supported by our placement assistance throughout.",
  },
  {
    icon: HeartHandshake,
    title: "Continue Placement Support",
    description: "Receive continued support throughout your job-search journey and beyond.",
  },
];

export async function PlacementJourney() {
  const waHref = await whatsappUrl("placement").catch(() => "#");

  return (
    <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-24">
      {/* Decorative dot grid */}
      <div
        className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      {/* Teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-teal/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-soft/30 bg-teal/15 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-soft" aria-hidden />
            Placement Journey
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">
            Placement assistance, end-to-end
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
            Placement assistance with a very high placement rate. Here is how we support
            you through the journey — from choosing a course to interviewing with employers.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 50}>
              <li className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-teal-soft/40 hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal-soft">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-heading text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 font-heading text-base font-bold text-white">{step.title}</h3>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-slate-300">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-teal-soft" aria-hidden />
              <p className="text-sm text-slate-200">
                <span className="font-semibold text-white">Not a job guarantee.</span>{" "}
                Actual hiring depends on employer requirements and candidate suitability.
                We support you throughout with placement assistance.
              </p>
            </div>
            <WhatsAppButton href={waHref} className="w-full shrink-0 sm:w-auto">
              Talk about placement
            </WhatsAppButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
