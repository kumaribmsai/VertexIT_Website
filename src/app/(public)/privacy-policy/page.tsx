import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { getSiteSettings } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Privacy Policy | VertexIT",
  description:
    "How VertexIT collects, uses, stores and protects personal data submitted through our website and enquiry forms.",
  path: "/privacy-policy",
});

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          We collect the information you voluntarily provide when you interact with our website —
          for example when you submit an enquiry, apply for a course, or apply for a job listing.
          This typically includes:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Your name, phone number and (optionally) email address</li>
          <li>Details about your education, work experience and career goals</li>
          <li>The course or role you are interested in</li>
          <li>Your preferred training mode and any message you choose to share</li>
          <li>For job applications: your resume and any cover message you submit</li>
        </ul>
        <p className="mt-3">
          We aim for data minimisation: we only collect what we genuinely need to respond to your
          enquiry or process your application. Candidate contact information is personal data and
          is never exposed publicly.
        </p>
        <p className="mt-3">
          We also receive limited technical information automatically, such as the referring URL,
          landing page, user agent and (where applicable) basic UTM campaign parameters, to help us
          improve our website and outreach.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    body: (
      <>
        <p>We use the information you share with us to:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Respond to your enquiry and answer questions about courses, fees, schedule or placement assistance</li>
          <li>Guide you through the counselling, enrolment and training process</li>
          <li>Share relevant opportunities through our placement assistance, where applicable</li>
          <li>Process job applications you submit through our website</li>
          <li>Improve our website, course content and outreach</li>
          <li>Meet applicable legal, accounting or regulatory obligations</li>
        </ul>
        <p className="mt-3">
          We do not sell your personal data. We do not share your data with third parties for
          unrelated marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: "data-storage-security",
    title: "Data storage & security",
    body: (
      <>
        <p>
          Your information is stored in systems we control — including our application database —
          and is accessed only by authorised VertexIT personnel (such as counsellors and
          administrators) who need it to respond to your enquiry or support your journey.
        </p>
        <p className="mt-3">
          We apply reasonable technical and organisational measures to protect personal data
          against unauthorised access, loss, misuse or alteration. These include access controls,
          hashed admin credentials, audit logging and restricted administrative permissions.
        </p>
        <p className="mt-3">
          No system can be guaranteed to be perfectly secure. If we become aware of a security
          breach affecting your personal data, we will take reasonable steps to notify affected
          individuals and regulators where required.
        </p>
      </>
    ),
  },
  {
    id: "cookies-tracking",
    title: "Cookies & tracking",
    body: (
      <>
        <p>
          Our website uses minimal cookies and similar technologies. Some cookies are strictly
          necessary for the website to function (such as maintaining your session). Others, if
          enabled, may be used to understand how visitors use the site so we can improve it.
        </p>
        <p className="mt-3">
          We do not use cookies to display intrusive cross-site advertising. Where third-party
          analytics or similar tools are added in the future, this policy will be updated to
          reflect their use, and we will provide an appropriate way to manage preferences where
          required by law.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    body: (
      <>
        <p>
          We use a small number of trusted third-party processors to operate our website. These
          processors act on our instructions and have their own security and privacy practices:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            <strong>Resend</strong> — used as our email provider to send you confirmation and
            notification emails in relation to your enquiry or application.
          </li>
          <li>
            <strong>NextAuth.js</strong> — used to authenticate authorised VertexIT administrators
            (counsellors and content editors) and to protect the administrative areas of the
            website. NextAuth is not used to track public visitors.
          </li>
        </ul>
        <p className="mt-3">
          We do not knowingly share your personal data with any third party for purposes other
          than those described in this policy.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>You have the right to:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate personal data</li>
          <li>Request deletion of your personal data, subject to legal and contractual obligations</li>
          <li>Object to or restrict certain processing of your personal data</li>
          <li>Withdraw consent for any processing based on your consent (without affecting the lawfulness of processing before withdrawal)</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us using the details below. We will
          respond within a reasonable timeframe and in line with applicable law.
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
          If you have any questions about this Privacy Policy or how we handle your personal data,
          please contact us:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            By phone:{" "}
            <a className="font-semibold text-teal hover:text-teal/80" href="tel:9703686514">
              9703686514
            </a>
          </li>
          <li>
            By WhatsApp:{" "}
            <a
              className="font-semibold text-teal hover:text-teal/80"
              href="https://wa.me/919703686514"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 97036 86514
            </a>
          </li>
          <li>
            Through our <Link href="/contact" className="font-semibold text-teal hover:text-teal/80">contact page</Link>
          </li>
        </ul>
        <p className="mt-3">
          VertexIT is based in {`Bengaluru, Karnataka, India`}.
        </p>
      </>
    ),
  },
];

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Legal
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              How {settings.brandName} collects, uses, stores and protects the personal data you
              share with us.
            </p>
            <p className="mt-4 text-xs text-slate-400">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </section>

      {/* Draft notice */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-medium text-amber-800">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
            This is a draft privacy policy. Please review with legal counsel before production use.
          </p>
        </div>
      </div>

      {/* Body */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <p className="text-[0.95rem] leading-relaxed text-slate-700">
              This Privacy Policy explains how {settings.brandName} (&ldquo;VertexIT&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal data when you use our website and
              the services offered through it. By using our website, you agree to the practices
              described below.
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
              This is a draft privacy policy. Please review with legal counsel before production
              use. This document may be updated from time to time; the &ldquo;last updated&rdquo;
              date above reflects the most recent revision.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
