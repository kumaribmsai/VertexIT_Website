import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Wallet,
  CalendarClock,
  CheckCircle2,
  ListChecks,
  FileText,
  ArrowRight,
  GraduationCap,
  Languages,
} from "lucide-react";

import { db } from "@/lib/db";
import { getJobBySlug, getCourseBySlug } from "@/services/public";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { JobApplyForm } from "@/components/site/job-apply-form";

export async function generateStaticParams() {
  try {
    const jobs = await db.job.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return jobs.map((j) => ({ slug: j.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || !job.isPublished) return {};
  return buildPageMetadata({
    title: job.metaTitle || `${job.title} | VertexIT Jobs`,
    description:
      job.metaDescription ||
      `${job.title}${job.location ? ` · ${job.location}` : ""}${
        job.experience ? ` · ${job.experience}` : ""
      } — apply directly via VertexIT.`,
    path: `/jobs/${job.slug}`,
    type: "website",
  });
}

function splitLines(input?: string | null): string[] {
  if (!input) return [];
  return input
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job || !job.isPublished || job.isExpired) {
    notFound();
  }

  const skills = splitLines(job.skills);
  const responsibilities = splitLines(job.responsibilities);
  const requirements = splitLines(job.requirements);
  const description = job.description.trim();

  const company = job.company?.trim() || "Confidential";
  const salary = job.salary?.trim();
  const closingDate = job.closingDate ? new Date(job.closingDate) : null;
  const postedDate = new Date(job.postedDate);
  const isClosingSoon = closingDate
    ? isAfter(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), closingDate)
    : false;

  // Resolve related course via job.courseId (preferred) or courseDomain slug.
  let relatedCourse: { slug: string; title: string } | null = null;
  if (job.courseId) {
    const c = await db.course.findUnique({
      where: { id: job.courseId },
      select: { slug: true, title: true, isPublished: true },
    });
    if (c && c.isPublished) {
      relatedCourse = { slug: c.slug, title: c.title };
    }
  }
  if (!relatedCourse && job.courseDomain) {
    const c = await getCourseBySlug(job.courseDomain);
    if (c && c.isPublished) {
      relatedCourse = { slug: c.slug, title: c.title };
    }
  }

  const waHref = await whatsappUrl(
    "jobs",
    `Hi VertexIT, I'd like to apply for the ${job.title} role${job.location ? ` in ${job.location}` : ""}. Please share next steps.`,
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const breadcrumbItems = [
    { name: "Home", url: siteUrl },
    { name: "Jobs", url: `${siteUrl}/jobs` },
    { name: job.title, url: `${siteUrl}/jobs/${job.slug}` },
  ];

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.responsibilities || job.title,
    datePosted: postedDate.toISOString(),
    validThrough: closingDate ? closingDate.toISOString() : undefined,
    employmentType: job.jobType,
    jobLocationType: job.workMode === "Remote" ? "TELECOMMUTE" : undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: company === "Confidential" ? "VertexIT (on behalf of hiring team)" : company,
    },
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "IN",
          },
        }
      : undefined,
    identifier: { "@type": "PropertyValue", name: "VertexIT", value: job.slug },
  };

  return (
    <article className="bg-white">
      <JsonLd data={jobPostingJsonLd} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />

      {/* Hero */}
      <header className="border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Jobs", href: "/jobs" },
              { label: job.title },
            ]}
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-teal">
                  {job.workMode}
                </span>
                <span className="inline-flex items-center rounded-full bg-navy/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-navy">
                  {job.jobType}
                </span>
                {isClosingSoon && closingDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-amber-700">
                    <CalendarClock className="h-3 w-3" /> Closes soon
                  </span>
                )}
              </div>
              <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy sm:text-4xl text-balance">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-teal" /> {company}
                </span>
                {job.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-teal" /> {job.location}
                  </span>
                )}
                {job.experience && (
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-teal" /> {job.experience}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Posted {formatDistanceToNow(postedDate, { addSuffix: true })}
                </span>
              </div>
              {salary && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-4 py-2 text-sm font-semibold text-teal">
                  <Wallet className="h-4 w-4" /> {salary}
                </p>
              )}
            </div>

            {/* Quick summary card */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quick summary
              </h2>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Wallet className="h-4 w-4 text-teal" /> Salary
                  </dt>
                  <dd className="font-medium text-navy text-right">
                    {salary || "To be discussed"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4 text-teal" /> Type
                  </dt>
                  <dd className="font-medium text-navy text-right">{job.jobType}</dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-teal" /> Mode
                  </dt>
                  <dd className="font-medium text-navy text-right">{job.workMode}</dd>
                </div>
                {job.experience && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <GraduationCap className="h-4 w-4 text-teal" /> Experience
                    </dt>
                    <dd className="font-medium text-navy text-right">{job.experience}</dd>
                  </div>
                )}
                {closingDate && (
                  <div className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarClock className="h-4 w-4 text-teal" /> Closing
                    </dt>
                    <dd className="font-medium text-navy text-right">
                      {format(closingDate, "d MMM yyyy")}
                    </dd>
                  </div>
                )}
              </dl>
              <a
                href="#apply"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-navy text-sm font-semibold text-white transition-colors hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                Apply Now
              </a>
            </aside>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-12">
            {description && (
              <Reveal>
                <section aria-labelledby="job-desc-heading">
                  <h2 id="job-desc-heading" className="font-heading text-xl font-bold text-navy sm:text-2xl">
                    About this role
                  </h2>
                  <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-slate-700">
                    {description.split(/\n+/).filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {responsibilities.length > 0 && (
              <Reveal>
                <section aria-labelledby="resp-heading">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <ListChecks className="h-5 w-5" />
                    </span>
                    <h2 id="resp-heading" className="mt-1 font-heading text-xl font-bold text-navy sm:text-2xl">
                      Key responsibilities
                    </h2>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {requirements.length > 0 && (
              <Reveal>
                <section aria-labelledby="req-heading">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <FileText className="h-5 w-5" />
                    </span>
                    <h2 id="req-heading" className="mt-1 font-heading text-xl font-bold text-navy sm:text-2xl">
                      What we're looking for
                    </h2>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {skills.length > 0 && (
              <Reveal>
                <section aria-labelledby="skills-heading">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                      <Languages className="h-5 w-5" />
                    </span>
                    <h2 id="skills-heading" className="mt-1 font-heading text-xl font-bold text-navy sm:text-2xl">
                      Skills you'll bring
                    </h2>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center rounded-md bg-teal/8 px-2.5 py-1 text-sm font-medium text-teal"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {relatedCourse && (
              <Reveal>
                <aside className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                    Recommended training
                  </p>
                  <h3 className="mt-1 font-heading text-base font-bold text-navy">
                    New to this domain? Start here.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    This opening aligns with the skills covered in our <span className="font-semibold text-navy">{relatedCourse.title}</span> program. Build the foundation first, then apply with confidence.
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/courses/${relatedCourse.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80"
                    >
                      View {relatedCourse.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </aside>
              </Reveal>
            )}
          </div>

          {/* Sidebar: Apply form */}
          <aside id="apply" className="scroll-mt-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal">
                Apply now
              </p>
              <h2 className="mt-1 font-heading text-lg font-bold text-navy">
                Submit your application
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Fields marked <span className="text-destructive">*</span> are required. Your information is kept confidential.
              </p>
              <div className="mt-5">
                <JobApplyForm
                  jobId={job.id}
                  jobTitle={job.title}
                  whatsappHref={waHref}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
