import { CheckCircle2, MapPin, Building2 } from "lucide-react";
import { getPublishedCourses } from "@/services/public";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { LinkButton } from "@/components/site/buttons";
import Link from "next/link";

function splitSkills(input: string): string[] {
  if (!input) return [];
  return input
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const FALLBACK_SKILLS: Record<string, string[]> = {
  "us-mortgage-underwriting": [
    "Loan file analysis",
    "Credit analysis",
    "Income analysis (W-2 & self-employed)",
    "DTI, LTV, CLTV calculation",
    "AUS concepts (DU / LP)",
    "Fannie Mae / Freddie Mac guideline awareness",
  ],
  "australia-mortgage": [
    "Loan application processing",
    "Document collection & verification",
    "Borrower assessment",
    "Income & living expense review",
    "Credit assessment",
    "Loan administration & broker support",
  ],
};

export async function WhatYouLearn() {
  let courses: Awaited<ReturnType<typeof getPublishedCourses>> = [];
  try {
    courses = await getPublishedCourses();
  } catch {
    /* graceful */
  }

  // Match course slugs to fallbacks if needed
  const usCourse = courses.find((c) => c.slug === "us-mortgage-underwriting") ?? courses[0];
  const auCourse = courses.find((c) => c.slug === "australia-mortgage") ?? courses[1];

  const usSkills = usCourse ? splitSkills(usCourse.keySkills) : FALLBACK_SKILLS["us-mortgage-underwriting"];
  const auSkills = auCourse ? splitSkills(auCourse.keySkills) : FALLBACK_SKILLS["australia-mortgage"];

  const panels = [
    {
      course: usCourse,
      fallbackSlug: "us-mortgage-underwriting",
      flag: "🇺🇸",
      region: "United States",
      title: usCourse?.title ?? "US Mortgage – Underwriting",
      blurb:
        "Build underwriting skills hiring teams look for — from loan file analysis to AUS interpretation and guideline awareness.",
      skills: usSkills.length ? usSkills : FALLBACK_SKILLS["us-mortgage-underwriting"],
      accent: "from-navy to-navy-light",
    },
    {
      course: auCourse,
      fallbackSlug: "australia-mortgage",
      flag: "🇦🇺",
      region: "Australia",
      title: auCourse?.title ?? "Australia Mortgage",
      blurb:
        "Learn the Australian home loan lifecycle end-to-end — from loan application processing to broker support and loan administration.",
      skills: auSkills.length ? auSkills : FALLBACK_SKILLS["australia-mortgage"],
      accent: "from-teal to-teal-light",
    },
  ];

  return (
    <section className="bg-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="What You Will Learn"
          title="Practical, job-focused curriculum"
          description="Each program is built around the real workflows used in the industry. No filler — just the skills you will use on the job."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {panels.map((p, i) => {
            const href = p.course ? `/courses/${p.course.slug}` : `/courses/${p.fallbackSlug}`;
            return (
              <Reveal key={p.region} delay={i * 80}>
                <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 card-hover">
                  {/* Top accent line */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${p.accent}`}
                    aria-hidden
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-teal">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {p.region} Track
                      </span>
                      <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-navy">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {p.blurb}
                      </p>
                    </div>
                    <span
                      className="text-3xl leading-none"
                      role="img"
                      aria-label={`${p.region} flag`}
                    >
                      {p.flag}
                    </span>
                  </div>

                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {p.skills.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden />
                        <span className="text-[0.82rem] leading-snug text-slate-700">{s}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80"
                    >
                      <Building2 className="h-4 w-4" aria-hidden />
                      View course details
                    </Link>
                    <LinkButton href={href} variant="outline" size="sm">
                      Curriculum
                    </LinkButton>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
