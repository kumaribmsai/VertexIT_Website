import type { Metadata } from "next";
import {
  Phone,
  MessageCircle,
  ClipboardCheck,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Reveal } from "@/components/site/reveal";
import { LeadForm } from "@/components/site/lead-form";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { getPublishedCourses } from "@/services/public";
import { whatsappUrl } from "@/lib/whatsapp";
import { getSiteSettings } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = await buildPageMetadata({
  title: "Apply / Enquire | VertexIT",
  description:
    "Talk to a VertexIT counsellor. Fill in your details and our team will guide you through the right IT training path for your career goals.",
  path: "/apply",
});

type Course = Awaited<ReturnType<typeof getPublishedCourses>>[number];

const NEXT_STEPS = [
  {
    icon: ClipboardCheck,
    title: "We review your enquiry",
    desc: "Our team looks at your background, experience and the program you are interested in.",
  },
  {
    icon: UserCheck,
    title: "Counsellor contacts you",
    desc: "A VertexIT counsellor reaches out — typically within one business day — to understand your goals.",
  },
  {
    icon: Sparkles,
    title: "Personalised course recommendation",
    desc: "You get a recommendation on which program suits you, plus details on schedule, fees and placement assistance.",
  },
];

export default async function ApplyPage() {
  const [courses, settings, waHref] = await Promise.all([
    getPublishedCourses(),
    getSiteSettings(),
    whatsappUrl("apply"),
  ]);

  const courseOptions = courses.map((c: Course) => ({ id: c.id, title: c.title }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-teal/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Apply" }]} />
          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden />
              Get Started
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Talk to a VertexIT counsellor
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg text-balance">
              Fill in your details and our team will reach out to guide you through the right
              training path for your career goals.
            </p>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:items-start">
            {/* LeadForm */}
            <Reveal>
              <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading text-xl font-bold text-navy sm:text-2xl">
                  Enquire about training
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fields marked with <span className="text-teal">*</span> are required.
                </p>
                <div className="mt-6">
                  <LeadForm courses={courseOptions} source="apply" />
                </div>
              </div>
            </Reveal>

            {/* Sidebar: quick contact + what happens next */}
            <Reveal delay={120}>
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Quick contact */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
                  <h2 className="font-heading text-base font-bold text-navy">
                    Prefer to reach us directly?
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Use WhatsApp or call us — we usually respond quickly during business hours.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <WhatsAppButton href={waHref} className="w-full">
                      WhatsApp Us
                    </WhatsAppButton>
                    <LinkButton
                      href={`tel:${settings.phone}`}
                      variant="outline"
                      className="w-full"
                    >
                      <Phone className="h-4 w-4" /> Call {settings.phone}
                    </LinkButton>
                  </div>
                </div>

                {/* What happens next */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="font-heading text-base font-bold text-navy">
                    What happens next?
                  </h2>
                  <ol className="mt-5 space-y-5">
                    {NEXT_STEPS.map((step, i) => (
                      <li key={step.title} className="flex items-start gap-4">
                        <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-heading text-sm font-bold text-navy">
                            {step.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {step.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <p className="text-xs leading-relaxed text-slate-500">
                  By submitting this form, you agree to be contacted by VertexIT regarding your
                  enquiry. Your information is handled in line with our{" "}
                  <a href="/privacy-policy" className="font-semibold text-teal hover:text-teal/80">
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer CTA strip */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <MessageCircle className="mx-auto h-7 w-7 text-teal" />
          <h2 className="mt-3 font-heading text-xl font-bold text-navy sm:text-2xl">
            Still deciding? Take your time.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Explore our courses and placement process, or send us a quick WhatsApp message — no
            commitment required.
          </p>
        </div>
      </section>
    </>
  );
}
