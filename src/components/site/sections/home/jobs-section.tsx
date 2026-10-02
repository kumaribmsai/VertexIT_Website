import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { getPublishedJobs } from "@/services/public";
import { JobCard } from "@/components/site/job-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/state";
import { WhatsAppButton } from "@/components/site/buttons";
import { whatsappUrl } from "@/lib/whatsapp";

export async function HomeJobs() {
  let jobs: Awaited<ReturnType<typeof getPublishedJobs>> = [];
  let waHref = "#";
  try {
    [jobs, waHref] = await Promise.all([
      getPublishedJobs(),
      whatsappUrl("jobs"),
    ]);
  } catch {
    /* graceful */
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Current Openings"
            title="Open mortgage roles"
            description="Live opportunities from our partner network. Apply directly through the listing, or speak to our career counsellor to find the right role for you."
            className="max-w-2xl"
          />
          {jobs.length > 0 && (
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
            >
              View all jobs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
        </div>

        <div className="mt-10">
          {jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No current openings have been published yet"
              description="Check back soon or speak to our career counsellor — we will share relevant opportunities aligned with your training as they come in."
              action={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <WhatsAppButton href={waHref}>Speak with a counsellor</WhatsAppButton>
                  <Link
                    href="/jobs"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-navy/15 px-6 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
                  >
                    Visit jobs page
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.slice(0, 6).map((j, i) => (
                <Reveal key={j.id} delay={i * 60} className="h-full">
                  <JobCard job={j} className="h-full" />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
