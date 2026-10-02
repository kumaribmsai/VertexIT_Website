import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  GraduationCap,
  Wrench,
  FileText,
  Mic,
  Send,
  Users,
  Repeat,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { LinkButton, WhatsAppButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Placement Process | VertexIT Mortgage Training",
  description:
    "Understand how VertexIT placement assistance works — from course selection to interview preparation and ongoing placement support. Placement assistance with a very high placement rate.",
  path: "/placement-process",
});

const STEPS = [
  {
    icon: ClipboardList,
    title: "Choose your course",
    desc: "Speak with a counsellor to identify the program — US Mortgage Underwriting or Australia Mortgage Operations — that best matches your background and career goals.",
  },
  {
    icon: GraduationCap,
    title: "Complete training",
    desc: "Attend the structured modules, practical exercises and case studies that make up your chosen course, whether online, offline or hybrid.",
  },
  {
    icon: Wrench,
    title: "Build job-ready skills",
    desc: "Practise on real-world mortgage and lending operations scenarios — documents, workflows and tools — so you build familiarity with what the role actually involves.",
  },
  {
    icon: FileText,
    title: "Resume and profile preparation",
    desc: "Get guidance on shaping a resume that highlights relevant skills and training for mortgage and lending operations roles.",
  },
  {
    icon: Mic,
    title: "Mock interview / interview preparation",
    desc: "Practise common interview questions, role-specific scenarios and behavioural rounds through structured mock interviews.",
  },
  {
    icon: Send,
    title: "Receive relevant opportunities",
    desc: "As suitable openings become available, we share relevant opportunities aligned to your training and profile.",
  },
  {
    icon: Users,
    title: "Interview with employers",
    desc: "Where applicable, interview with hiring organisations. We help you prepare for each specific conversation.",
  },
  {
    icon: Repeat,
    title: "Continue placement support",
    desc: "Placement support continues beyond a single interview cycle, with guidance and follow-up based on your progress.",
  },
];

const INCLUDED = [
  {
    icon: FileText,
    title: "Resume guidance",
    desc: "Resume reviews and structured feedback to present your training and skills effectively.",
  },
  {
    icon: Mic,
    title: "Mock interviews",
    desc: "Practice rounds that simulate real mortgage operations interviews, with constructive feedback.",
  },
  {
    icon: ShieldAlert,
    title: "Interview preparation",
    desc: "Role-specific prep — common questions, scenarios and what to expect in mortgage hiring rounds.",
  },
  {
    icon: Send,
    title: "Relevant opportunities",
    desc: "Openings shared as they become available, aligned to your training and profile.",
  },
  {
    icon: Users,
    title: "Career counselling",
    desc: "One-on-one guidance on which path within mortgage and lending operations suits you best.",
  },
  {
    icon: GraduationCap,
    title: "Skills reinforcement",
    desc: "Continued reinforcement of the skills learned in training, so you stay sharp through the process.",
  },
];

export default async function PlacementProcessPage() {
  const waHref = await whatsappUrl("placement");
  const applyHref = "/apply";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Placement Process" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Placement Journey
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              How VertexIT placement assistance works
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              A transparent, step-by-step view of our placement assistance process — from choosing
              your course to interviewing with employers and continuing placement support. We aim
              for placement assistance with a very high placement rate, while being honest that
              actual hiring depends on employer requirements and candidate suitability.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The journey"
            title="Eight steps, end to end"
            description="From course selection to ongoing placement support — here is what the process looks like."
          />

          <ol className="relative mt-12 border-l border-slate-200 pl-8 sm:pl-10">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 60} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[2.55rem] sm:-left-[3.05rem] inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white shadow-sm ring-4 ring-white">
                  {i + 1}
                </span>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 card-hover sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Step {i + 1}
                      </p>
                      <h3 className="mt-0.5 font-heading text-lg font-bold text-navy">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Disclaimer block */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <aside
              role="note"
              className="rounded-2xl border-l-4 border-teal bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold text-navy">
                    Important: please read this carefully
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Placement assistance with a very high placement rate. Actual hiring depends on
                    employer requirements and candidate suitability. VertexIT does not guarantee
                    every candidate a job.
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Placement assistance is provided according to institute policy and is subject
                    to candidate participation in the training, preparation and interview process.
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What's included"
            title="What placement assistance covers"
            description="A clear breakdown of the support you receive as part of placement assistance."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 card-hover">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
            Get started
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl text-balance">
            Have questions about placement assistance?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Talk to a VertexIT counsellor to understand how the process applies to your background
            and goals. We will walk you through each step honestly and clearly.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <LinkButton href={applyHref} variant="default">
              Talk to a Counsellor <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <WhatsAppButton
              href={waHref}
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-teal hover:text-teal-soft"
            >
              WhatsApp Us
            </WhatsAppButton>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Or read our{" "}
            <Link href="/disclaimer" className="font-semibold text-teal-soft hover:text-white">
              disclaimer
            </Link>{" "}
            for the full placement and training policy.
          </p>
        </div>
      </section>
    </>
  );
}
