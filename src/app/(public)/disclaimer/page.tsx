import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { getSiteSettings } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Disclaimer | VertexIT",
  description:
    "VertexIT disclaimer — training does not automatically guarantee employment, placement assistance is provided according to institute policy, and actual hiring depends on employer requirements.",
  path: "/disclaimer",
});

const CLAUSES = [
  {
    title: "Training does not guarantee employment",
    body: "Completion of any VertexIT training program does not automatically guarantee employment. Training is designed to build practical, job-ready skills in mortgage and lending operations; securing a role is a separate outcome that depends on multiple factors.",
  },
  {
    title: "Placement assistance is provided according to institute policy",
    body: "Placement assistance is provided according to institute policy and typically includes resume guidance, mock interviews, interview preparation, sharing of relevant opportunities where available, and continued support during the interview process. The nature and extent of assistance may vary by program and is contingent on the candidate's active participation in training and preparation.",
  },
  {
    title: "Actual hiring depends on employer requirements and candidate suitability",
    body: "Actual hiring depends on employer requirements and candidate suitability. VertexIT does not guarantee every candidate a job and does not represent that any particular employer will hire a candidate. We do not promise a 100% job guarantee or placement to any specific organisation.",
  },
  {
    title: "Course content is educational",
    body: "All course content — including modules, case studies, exercises and supporting materials — is provided for educational purposes. It reflects industry practices at the time of writing but is not a substitute for employer-specific training, professional advice, or compliance guidance for any specific transaction or jurisdiction.",
  },
  {
    title: "Regulatory and licensing requirements vary by jurisdiction",
    body: "Mortgage and lending operations are regulated differently across jurisdictions. Roles, responsibilities, and any required licensing or registration vary by country, state or region. Candidates are responsible for understanding and meeting any regulatory or licensing requirements applicable to their target role and location.",
  },
  {
    title: "Australia Mortgage training does not automatically grant broker licensing",
    body: "Our Australia Mortgage Operations training is an educational program. It should not be represented as automatically granting Australian mortgage broker licensing or any other regulatory authorisation. Australian mortgage broking is regulated, and licensing is issued by the relevant Australian authorities subject to their own requirements. Candidates seeking to operate as brokers in Australia must comply with those regulatory requirements independently.",
  },
  {
    title: "Testimonials and success stories",
    body: "Testimonials, placement stories and other student outcomes shared on this website reflect individual experiences and are not a guarantee of similar outcomes for any other candidate. Outcomes vary based on background, effort, market conditions and employer requirements. We publish such content only after verification and with the consent of the individuals involved.",
  },
  {
    title: "Website content accuracy",
    body: "We make reasonable efforts to keep the information on this website accurate and up to date. However, we do not warrant that all information — including course content, schedules, eligibility criteria and fees — is current, complete or error-free at all times. Please verify any information that affects your decision with a VertexIT counsellor before relying on it.",
  },
];

export default async function DisclaimerPage() {
  const [settings, waHref] = await Promise.all([
    getSiteSettings(),
    whatsappUrl("contact"),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Legal
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Disclaimer
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              Please read this disclaimer carefully. It explains what {settings.brandName} training
              and placement assistance can and cannot guarantee.
            </p>
            <p className="mt-4 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </section>

      {/* Notice */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-medium text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
            This is a draft. Please review with legal counsel before production use.
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <p className="text-[0.95rem] leading-relaxed text-slate-700">
              The information and materials provided by {settings.brandName} (&ldquo;VertexIT&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;) on this website and through our training programs
              are intended for general informational and educational purposes only. The following
              clauses apply to all our offerings.
            </p>
          </Reveal>

          {/* Highlighted summary */}
          <Reveal>
            <aside className="mt-8 rounded-2xl border-l-4 border-teal bg-teal/5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <ShieldAlert className="h-6 w-6 shrink-0 text-teal" />
                <div>
                  <p className="font-heading text-base font-bold text-navy">
                    In short
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">
                    Training does not automatically guarantee employment. Placement assistance is
                    provided according to institute policy. Actual hiring depends on employer
                    requirements and candidate suitability. VertexIT does not guarantee every
                    candidate a job.
                  </p>
                </div>
              </div>
            </aside>
          </Reveal>

          {/* Detailed clauses */}
          <div className="mt-12 space-y-10">
            {CLAUSES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 60}>
                <section>
                  <h2 className="font-heading text-lg font-bold text-navy sm:text-xl">
                    {i + 1}. {c.title}
                  </h2>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-700">{c.body}</p>
                </section>
              </Reveal>
            ))}
          </div>

          {/* Contact / clarification */}
          <Reveal>
            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
              <h2 className="font-heading text-base font-bold text-navy">
                Have questions about this disclaimer?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                We are happy to clarify anything in this disclaimer before you enrol. Please reach
                out — we will answer honestly and clearly.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <WhatsAppButton href={waHref}>WhatsApp Us</WhatsAppButton>
                <LinkButton href="/contact" variant="outline">
                  Contact Us
                </LinkButton>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Or read our{" "}
                <Link href="/terms-and-conditions" className="font-semibold text-teal hover:text-teal/80">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="font-semibold text-teal hover:text-teal/80">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </Reveal>

          <div className="mt-8">
            <p className="text-xs leading-relaxed text-slate-500">
              This is a draft. Please review with legal counsel before production use. This
              disclaimer may be updated from time to time; the &ldquo;last updated&rdquo; date above
              reflects the most recent revision.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
