import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJobs } from "@/services/public";
import { getSiteSettings } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { JobCard } from "@/components/site/job-card";
import { EmptyState } from "@/components/site/state";
import { Reveal } from "@/components/site/reveal";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { Briefcase, Phone, Bell } from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "IT Jobs & Career Opportunities | VertexIT",
  description:
    "Current job openings in software engineering, data analysis, and IT operations. Apply directly through VertexIT — careers for trained candidates in Bengaluru and beyond.",
  path: "/jobs",
});

export default async function JobsPage() {
  const [jobs, settings, waHref] = await Promise.all([
    getPublishedJobs(),
    getSiteSettings(),
    whatsappUrl("jobs"),
  ]);

  return (
    <div className="bg-white">
      {/* Hero / heading band */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Jobs" }]} />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              align="left"
              eyebrow="CURRENT OPENINGS"
              title="IT Career Opportunities"
              description="Direct openings for candidates trained in software engineering, processing and operations. New roles are posted as partner teams open them — apply directly through VertexIT."
            />
            {jobs.length > 0 && (
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-teal/20 bg-teal/5 px-4 py-2 text-sm font-medium text-teal">
                <Bell className="h-4 w-4" />
                {jobs.length} active {jobs.length === 1 ? "opening" : "openings"}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs list */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {jobs.length === 0 ? (
          <EmptyState
            title="No current openings have been published yet"
            description="We publish new openings as hiring teams confirm them. Check back soon, or speak to our career counsellor to be notified when relevant roles open up."
            icon={Briefcase}
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <WhatsAppButton href={waHref}>WhatsApp Our Counsellor</WhatsAppButton>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-navy/15 px-6 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
                >
                  <Phone className="h-4 w-4" /> Call {settings.phone}
                </a>
              </div>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <Reveal key={job.id} delay={i * 60}>
                <JobCard job={job} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA — explore training */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="bg-dot-grid absolute inset-0 opacity-50" aria-hidden />
            <div className="relative">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                Build the skills first
              </p>
              <h2 className="mt-2 font-heading text-lg font-bold text-navy">
                Don't see a role that fits?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If you're new to IT operations, start with our training programs. They're designed to make you job-ready for underwriting, processing and operations roles.
              </p>
              <div className="mt-4">
                <LinkButton href="/courses" variant="default" size="sm">
                  Explore Courses
                </LinkButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-navy p-6 text-white sm:p-7">
            <div className="bg-dot-grid absolute inset-0 opacity-30" aria-hidden />
            <div className="relative">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                Get notified
              </p>
              <h2 className="mt-2 font-heading text-lg font-bold">
                Want updates on new openings?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Speak with our career counsellor. We'll keep your profile ready for relevant roles as they open.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <WhatsAppButton href={waHref} variant="default" size="sm">
                  WhatsApp Us
                </WhatsAppButton>
                <Link
                  href="/contact"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:border-teal hover:text-teal-soft"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
