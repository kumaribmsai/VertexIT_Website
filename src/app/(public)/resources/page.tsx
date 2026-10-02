import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { LinkButton } from "@/components/site/buttons";
import {
  FileText, Download, BookOpen, FileCheck2, Briefcase, GraduationCap,
  ListChecks, Phone, ArrowRight, Lock,
} from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "Free Mortgage Career Resources",
  description:
    "Download free guides for mortgage career preparation — interview questions, resume tips, mortgage fundamentals and more from VertexIT.",
  path: "/resources",
});

type Resource = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  pages: number;
  type: "PDF Guide" | "Checklist" | "Cheat Sheet";
  gated: boolean;
  href: string;
};

const RESOURCES: Resource[] = [
  {
    title: "Mortgage Underwriting Interview Questions",
    description: "25 common interview questions for US Mortgage Underwriting roles — with sample answers and what hiring teams look for.",
    icon: FileText,
    category: "Interview Prep",
    pages: 12,
    type: "PDF Guide",
    gated: true,
    href: "/apply?resource=interview-questions",
  },
  {
    title: "Mortgage Operations Resume Template",
    description: "A recruiter-friendly resume template tailored for mortgage operations and underwriting roles. ATS-optimised format.",
    icon: FileCheck2,
    category: "Resume & LinkedIn",
    pages: 4,
    type: "PDF Guide",
    gated: true,
    href: "/apply?resource=resume-template",
  },
  {
    title: "US Mortgage Fundamentals Cheat Sheet",
    description: "Quick reference covering loan types, DTI, LTV, CLTV, AUS and key underwriting concepts — perfect for last-minute revision.",
    icon: BookOpen,
    category: "Fundamentals",
    pages: 6,
    type: "Cheat Sheet",
    gated: false,
    href: "#download-fundamentals",
  },
  {
    title: "Mortgage Career Pathways Guide",
    description: "Explore the full range of career pathways in mortgage operations — underwriting, processing, broker support, lending operations and more.",
    icon: Briefcase,
    category: "Career Advice",
    pages: 10,
    type: "PDF Guide",
    gated: false,
    href: "#download-pathways",
  },
  {
    title: "Australia Mortgage Operations Glossary",
    description: "50+ key terms and acronyms used in Australian mortgage operations — from LMI to LVR and broker support terminology.",
    icon: GraduationCap,
    category: "Fundamentals",
    pages: 8,
    type: "Cheat Sheet",
    gated: false,
    href: "#download-glossary",
  },
  {
    title: "Interview Preparation Checklist",
    description: "A step-by-step checklist to prepare for mortgage operations interviews — from research to mock interviews to follow-up.",
    icon: ListChecks,
    category: "Interview Prep",
    pages: 3,
    type: "Checklist",
    gated: true,
    href: "/apply?resource=interview-checklist",
  },
];

const CATEGORIES = ["All", "Interview Prep", "Resume & LinkedIn", "Fundamentals", "Career Advice"];

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
          <SectionHeading
            align="left"
            eyebrow="FREE RESOURCES"
            title="Mortgage career resources"
            description="Practical guides, checklists and cheat sheets to help you prepare for a career in mortgage and lending operations — free to download."
          />
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Category filter pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => (
              <span
                key={cat}
                className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  i === 0
                    ? "bg-navy text-white"
                    : "border border-slate-200 bg-white text-navy hover:border-teal"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Resources grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => (
              <Reveal key={r.title} delay={i * 60} className="h-full">
                <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 card-hover hover:border-teal/40">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal transition-transform group-hover:scale-105">
                      <r.icon className="h-5 w-5" />
                    </span>
                    {r.gated && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-700">
                        <Lock className="h-3 w-3" /> Email required
                      </span>
                    )}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-teal">
                    {r.category}
                  </span>
                  <h3 className="mt-1.5 font-heading text-base font-bold text-navy leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-500">
                      {r.type} · {r.pages} pages
                    </span>
                    <a
                      href={r.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal group-hover:gap-2 transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={200}>
            <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-navy p-8 sm:p-10">
              <div className="bg-dot-grid absolute inset-0 opacity-25" aria-hidden />
              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal-soft">
                    Want all resources in one bundle?
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-bold text-white sm:text-2xl">
                    Get the complete mortgage career prep kit
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Enroll in any VertexIT program and get access to all guides, templates and checklists — plus live mock interviews and personalised career counselling.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <LinkButton href="/apply" variant="default">
                    Talk to a Counsellor
                  </LinkButton>
                  <LinkButton href="/courses" variant="outline">
                    View Courses <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Disclaimer */}
          <p className="mt-8 flex items-start gap-2 text-xs text-muted-foreground">
            <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
            All resources are educational. Some downloads require an email address so we can share relevant updates. You can unsubscribe at any time. We never share your details.
          </p>
        </div>
      </section>
    </>
  );
}
