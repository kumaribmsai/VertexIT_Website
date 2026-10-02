import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { getSiteSettings } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Terms and Conditions | VertexIT",
  description:
    "The terms and conditions that apply to your use of the VertexIT website and training enrollment, including fees, placement assistance and limitation of liability.",
  path: "/terms-and-conditions",
});

const SECTIONS = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of terms",
    body: (
      <>
        <p>
          By accessing or using the VertexIT website (&ldquo;the Website&rdquo;), you agree to be
          bound by these Terms and Conditions. If you do not agree with any part of these terms,
          please do not use the Website or our services.
        </p>
        <p>
          These terms apply in addition to any separate agreement you may sign when enrolling in a
          training program. In the event of a conflict, the specific enrolment agreement prevails.
        </p>
      </>
    ),
  },
  {
    id: "use-of-website",
    title: "Use of website",
    body: (
      <>
        <p>You agree to use the Website only for lawful purposes and in a manner that does not:</p>
        <ul>
          <li>Infringe the rights of any other person</li>
          <li>Restrict or inhibit any other user from using the Website</li>
          <li>Involve transmitting viruses, malware or other harmful code</li>
          <li>Attempt to gain unauthorised access to any part of the Website, its systems or networks</li>
          <li>Submit false, misleading or fraudulent information through our enquiry or application forms</li>
        </ul>
        <p>
          We may modify, suspend or discontinue any part of the Website at any time without prior
          notice. We do not guarantee that the Website will be uninterrupted or error-free.
        </p>
      </>
    ),
  },
  {
    id: "training-enrollment",
    title: "Training enrollment",
    body: (
      <>
        <p>
          Enrolment in any VertexIT training program is subject to availability and to meeting any
          eligibility criteria communicated at the time of enrolment. Submission of an enquiry or
          application through the Website does not constitute a confirmed enrolment.
        </p>
        <p>
          Enrolment is confirmed only when both you and VertexIT have agreed on the program,
          schedule and applicable fees, and any required payment or deposit has been processed as
          per the institute&apos;s policy.
        </p>
        <p>
          We reserve the right to decline an enrolment request where a candidate does not meet
          eligibility criteria, where a batch is full, or where we believe the program is not a
          suitable fit for the candidate&apos;s background or goals.
        </p>
      </>
    ),
  },
  {
    id: "course-fees",
    title: "Course fees",
    body: (
      <>
        <p>
          Course fees, where applicable, are communicated to candidates directly during the
          counselling process. Fees may vary by program, schedule and training mode. We do not
          display fees publicly on the Website at launch.
        </p>
        <p>
          Any fee paid is generally non-refundable except as expressly stated in the enrolment
          agreement or as required by applicable law. Refunds, where applicable, are processed
          according to the institute&apos;s refund policy communicated at the time of enrolment.
        </p>
      </>
    ),
  },
  {
    id: "placement-assistance",
    title: "Placement assistance",
    body: (
      <>
        <p>
          Training does not automatically guarantee employment. Placement assistance is provided
          according to institute policy. Actual hiring depends on employer requirements and
          candidate suitability.
        </p>
        <p>
          Placement assistance typically includes resume guidance, mock interviews, interview
          preparation, sharing of relevant opportunities where available, and continued support
          during the interview process. The extent of assistance may vary by program and is
          contingent on the candidate&apos;s active participation in the training and preparation
          process.
        </p>
        <p>
          VertexIT does not guarantee every candidate a job and does not represent that any
          particular employer will hire a candidate. We do not charge candidates separately for
          placement assistance beyond what is communicated as part of the program fee.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p>
          All content on the Website — including text, graphics, logos, course materials, blog
          posts and design elements — is the property of VertexIT or its licensors and is protected
          by applicable intellectual property laws.
        </p>
        <p>
          You may not copy, reproduce, redistribute, publish, transmit or create derivative works
          of any content from the Website without prior written consent from VertexIT, except
          where permitted by law or where content is clearly intended for public distribution
          (such as publicly accessible blog posts for personal, non-commercial use).
        </p>
        <p>
          Training materials provided to enrolled candidates are for personal use only and may not
          be shared, redistributed or resold without written permission.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by applicable law, VertexIT, its directors, employees,
          trainers and partners shall not be liable for any indirect, incidental, special,
          consequential or punitive damages arising out of or related to your use of the Website
          or training services.
        </p>
        <p>
          We do not warrant that the Website or training services will meet your specific
          requirements or that they will be uninterrupted, error-free or free of harmful
          components. You use the Website and services at your own discretion.
        </p>
        <p>
          Nothing in these terms excludes or limits liability that cannot be excluded or limited
          under applicable law.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "Changes to terms",
    body: (
      <>
        <p>
          We may update these Terms and Conditions from time to time. Changes will be posted on
          this page with an updated &ldquo;last updated&rdquo; date. Continued use of the Website
          after changes are posted constitutes acceptance of the revised terms.
        </p>
        <p>
          For material changes that affect existing enrolled candidates, we will use reasonable
          efforts to communicate such changes directly where feasible.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>
          If you have any questions about these Terms and Conditions, please contact us:
        </p>
        <ul>
          <li>
            By phone:{" "}
            <a href="tel:9703686514">9703686514</a>
          </li>
          <li>
            By WhatsApp:{" "}
            <a href="https://wa.me/919703686514" target="_blank" rel="noopener noreferrer">
              +91 97036 86514
            </a>
          </li>
          <li>
            Through our <Link href="/contact">contact page</Link>
          </li>
        </ul>
      </>
    ),
  },
];

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms and Conditions" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Legal
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Terms and Conditions
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              The terms that apply to your use of the {settings.brandName} website and training
              services.
            </p>
            <p className="mt-4 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </section>

      {/* Draft notice */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-medium text-amber-800">
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            This is a draft. Please review with legal counsel.
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <p className="text-[0.95rem] leading-relaxed text-slate-700">
              Please read these Terms and Conditions carefully before using the VertexIT Website.
              These terms govern your access to and use of the Website and the services offered
              through it.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-navy transition-colors hover:border-teal hover:text-teal"
              >
                {s.title}
              </a>
            ))}
          </div>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl">
                  {s.title}
                </h2>
                <div className="prose-legal mt-3 text-[0.95rem] leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:text-teal [&_a:hover]:text-teal/80 [&_li]:mt-1 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mt-3 [&_p:first-child]:mt-0">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
            <p className="text-xs leading-relaxed text-slate-500">
              This is a draft. Please review with legal counsel. These terms may be updated from
              time to time; the &ldquo;last updated&rdquo; date above reflects the most recent
              revision.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
