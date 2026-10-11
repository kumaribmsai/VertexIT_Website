import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Repeat,
  Compass,
  Building2,
  MapPin,
  Sparkles,
  BookOpen,
  Layers,
  Users,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Target,
  HandHelping,
  Network,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "About VertexIT | Professional Career Training Institute",
  description:
    "VertexIT is a Bengaluru-based career training and placement assistance institute. Industry-focused curriculum, practical case studies and hybrid learning.",
  path: "/about",
});

const APPROACH_STEPS = [
  {
    icon: BookOpen,
    label: "LEARN",
    title: "Learn the fundamentals",
    desc: "Structured modules covering IT and software operations concepts, terminology and workflows used in the industry.",
  },
  {
    icon: Layers,
    label: "PRACTICE",
    title: "Practice on real scenarios",
    desc: "Case studies, document reviews and workflow exercises that mirror the day-to-day work of IT operations teams.",
  },
  {
    icon: Target,
    label: "PREPARE",
    title: "Prepare for interviews",
    desc: "Resume guidance, mock interviews and role-specific preparation to help you present with confidence.",
  },
  {
    icon: ArrowRight,
    label: "APPLY",
    title: "Apply for relevant roles",
    desc: "Receive relevant opportunities aligned to your training and apply through our placement assistance support.",
  },
  {
    icon: Briefcase,
    label: "BUILD YOUR CAREER",
    title: "Build your career",
    desc: "Continue placement support as you start your role and grow in the IT and software operations field.",
  },
];

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "Graduates",
    desc: "Fresh graduates looking to enter the IT and software operations field with structured, industry-focused training.",
  },
  {
    icon: Briefcase,
    title: "Experienced professionals",
    desc: "Working professionals from BPO, KPO, finance or operations backgrounds seeking a domain switch into IT.",
  },
  {
    icon: Repeat,
    title: "Career switchers",
    desc: "Professionals from unrelated fields who want a clear, structured path into a specialised IT operations career.",
  },
  {
    icon: Compass,
    title: "IT & lending aspirants",
    desc: "Candidates specifically seeking a career in US IT Training or Australian IT operations.",
  },
];

const VALUES = [
  {
    icon: BookOpen,
    title: "Industry-focused curriculum",
    desc: "Course content designed around real IT and software operations workflows rather than generic theory.",
  },
  {
    icon: Layers,
    title: "Practical case studies",
    desc: "Hands-on exercises that mirror actual work scenarios, so you build familiarity with documents and processes.",
  },
  {
    icon: Users,
    title: "Hybrid learning",
    desc: "Online, offline and live training options suited to working professionals and full-time students alike.",
  },
  {
    icon: HandHelping,
    title: "Placement assistance",
    desc: "Resume guidance, mock interviews and relevant opportunities through our placement assistance support.",
  },
];

export default async function AboutPage() {
  const waHref = await whatsappUrl("contact");
  const applyWa = await whatsappUrl("apply");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              About VertexIT
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Career-focused professional training, built for the real world
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              VertexIT is a dedicated career training and placement assistance institute based in
              Bengaluru. We help graduates, experienced professionals, and career switchers build
              practical, job-ready skills for high-demand industry roles — and support them
              through dedicated placement assistance.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <WhatsAppButton href={waHref}>WhatsApp Us</WhatsAppButton>
              <LinkButton
                href="/apply"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:border-teal hover:text-teal-soft"
              >
                Talk to Counsellor
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Intro / positioning */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <Reveal>
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Who we are"
                  title="A dedicated training and placement assistance institute"
                  description="VertexIT was set up to bridge the gap between academic learning and the practical skills that modern capability and operations teams actually use. Our programs are built around real industry workflows — including specialized US Mortgage Underwriting and Australian Mortgage Operations — with hands-on case studies and structured placement assistance."
                />
                <div className="mt-6 space-y-4 text-[0.95rem] leading-relaxed text-slate-600">
                  <p>
                    We are a private training institute. We are <strong className="text-navy">not</strong> a
                    university, and we do not claim government accreditation. What we offer is
                    structured, industry-focused training combined with placement assistance designed
                    to help candidates pursue relevant opportunities across leading industry and operations centers.
                  </p>
                  <p>
                    Our positioning is simple: <strong className="text-navy">Placement assistance with a
                    very high placement rate.</strong> Actual hiring, however, depends on employer
                    requirements and candidate suitability, and VertexIT does not guarantee every
                    candidate a job.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <aside className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy">
                  What we are — and are not
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>A training and placement assistance institute for IT &amp; lending operations.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>Industry-focused curriculum built around real workflows.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>Placement assistance with a very high placement rate.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 inline-block h-4 w-4 shrink-0 rounded-full border border-slate-300 text-center text-[0.7rem] leading-[0.95rem] text-slate-400">×</span>
                    <span className="text-slate-500">Not a university. Not government-accredited.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 inline-block h-4 w-4 shrink-0 rounded-full border border-slate-300 text-center text-[0.7rem] leading-[0.95rem] text-slate-400">×</span>
                    <span className="text-slate-500">We do not guarantee every candidate a job.</span>
                  </li>
                </ul>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Approach — visual flow */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our approach"
            title="Learn → Practice → Prepare → Apply → Build your career"
            description="A structured journey that takes you from IT fundamentals to a career in IT and software operations."
          />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {APPROACH_STEPS.map((step, i) => (
              <Reveal key={step.label} delay={i * 80}>
                <li className="relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 card-hover">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                    Step {i + 1} · {step.label}
                  </p>
                  <h3 className="mt-1 font-heading text-base font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for a wide range of career stages"
            description="Whether you are starting out, switching domains or sharpening specialised skills, our programs are designed to meet you where you are."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a, i) => (
              <Reveal key={a.title} delay={i * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 card-hover">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-navy">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bengaluru */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Why Bengaluru"
                  title="Where we are, and why it matters"
                  description="Bengaluru is one of India’s largest hubs for IT and software operations, with a high concentration of captive banking, BPO and KPO teams serving global lenders."
                />
                <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-600">
                  Being based in Bengaluru lets us stay close to the realities of the local IT
                  job market — the kinds of roles available, the workflows in demand, and the skills
                  employers expect. This helps shape a curriculum that is relevant to the
                  opportunities candidates actually pursue.
                </p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-600">
                  We do not run paid location-targeted landing pages or claim job-placement
                  statistics by city. If you are looking for IT training in Bengaluru, you can
                  reach us directly and we will help you understand the right path for your goals.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <MapPin className="h-6 w-6 text-teal" />
                  <p className="mt-3 font-heading text-lg font-bold text-navy">Bengaluru</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Karnataka, India. Hybrid training available for in-person and online learners.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <Building2 className="h-6 w-6 text-teal" />
                  <p className="mt-3 font-heading text-lg font-bold text-navy">Industry hub</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Strong presence of IT, banking and lending operations teams.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <Network className="h-6 w-6 text-teal" />
                  <p className="mt-3 font-heading text-lg font-bold text-navy">Relevant roles</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Underwriting, processing, closing, QC, origination support and related functions.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <Sparkles className="h-6 w-6 text-teal" />
                  <p className="mt-3 font-heading text-lg font-bold text-navy">Direct support</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Speak directly with our counsellors to plan your path — no middlemen.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values / qualitative cards */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What we stand for"
            title="Values that shape how we train"
            description="We focus on the things that genuinely help candidates move forward in their IT careers."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 card-hover">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-navy">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
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
            Take the next step
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold text-white sm:text-3xl text-balance">
            Ready to explore a career in IT and software operations?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300">
            Speak with a VertexIT counsellor today. We will help you understand which program suits
            your background, and walk you through the training and placement assistance journey.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <WhatsAppButton href={applyWa}>WhatsApp Us</WhatsAppButton>
            <LinkButton
              href="/apply"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-teal hover:text-teal-soft"
            >
              <MessageCircle className="h-4 w-4" /> Talk to Counsellor
            </LinkButton>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Or explore our{" "}
            <Link href="/courses" className="font-semibold text-teal-soft hover:text-white">
              courses
            </Link>{" "}
            and{" "}
            <Link href="/placement-process" className="font-semibold text-teal-soft hover:text-white">
              placement process
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
