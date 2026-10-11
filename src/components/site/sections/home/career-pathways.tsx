import { Briefcase, MapPin, ArrowUpRight, Info } from "lucide-react";
import Link from "next/link";
import { getPublishedCourses } from "@/services/public";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

function splitList(input: string): string[] {
  if (!input) return [];
  return input
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const FALLBACK_PATHWAYS: Record<string, string[]> = {
  "us-mortgage-underwriting": [
    "IT Support Engineer",
    "IT Operations Analyst",
    "IT operations Analyst",
    "Credit / Lending Support",
    "Underwriting Assistant",
  ],
  "australia-mortgage": [
    "IT Service Desk",
    "Broker Support Associate",
    "Loan Administration Analyst",
    "Lending Operations Analyst",
    "IT Virtual Assistant",
  ],
};

export async function CareerPathways() {
  let courses: Awaited<ReturnType<typeof getPublishedCourses>> = [];
  try {
    courses = await getPublishedCourses();
  } catch {
    /* graceful */
  }

  const usCourse = courses.find((c) => c.slug === "us-mortgage-underwriting") ?? courses[0];
  const auCourse = courses.find((c) => c.slug === "australia-mortgage") ?? courses[1];

  const usPathways = usCourse ? splitList(usCourse.careerPathways) : FALLBACK_PATHWAYS["us-mortgage-underwriting"];
  const auPathways = auCourse ? splitList(auCourse.careerPathways) : FALLBACK_PATHWAYS["australia-mortgage"];

  const panels = [
    {
      region: "United States",
      flag: "🇺🇸",
      title: usCourse?.title ?? "US Mortgage – Underwriting",
      href: usCourse ? `/courses/${usCourse.slug}` : "/courses/us-mortgage-underwriting",
      pathways: usPathways.length ? usPathways : FALLBACK_PATHWAYS["us-mortgage-underwriting"],
    },
    {
      region: "Australia",
      flag: "🇦🇺",
      title: auCourse?.title ?? "Australia Mortgage",
      href: auCourse ? `/courses/${auCourse.slug}` : "/courses/australia-mortgage",
      pathways: auPathways.length ? auPathways : FALLBACK_PATHWAYS["australia-mortgage"],
    },
  ];

  return (
    <section className="bg-slate-50/60 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Career Pathways"
          title="Potential career pathways"
          description="Examples of roles our training prepares you to pursue. These are potential pathways, not guaranteed outcomes — actual hiring depends on employer requirements and candidate suitability."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-xs text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              <span className="font-semibold">Note:</span> These are potential career pathways,
              not guaranteed roles. Placement assistance supports you throughout your job search.
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {panels.map((p, i) => (
            <Reveal key={p.region} delay={i * 80}>
              <article className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 card-hover sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-navy">
                      <MapPin className="h-3 w-3" aria-hidden />
                      {p.region} Track
                    </span>
                    <h3 className="mt-3 font-heading text-lg font-bold text-navy">{p.title}</h3>
                  </div>
                  <span
                    className="text-3xl leading-none"
                    role="img"
                    aria-label={`${p.region} flag`}
                  >
                    {p.flag}
                  </span>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Potential career pathways
                </p>
                <ul className="mt-3 space-y-2">
                  {p.pathways.map((role) => (
                    <li
                      key={role}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 transition-colors hover:border-teal/40 hover:bg-teal/5"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                        <Briefcase className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span className="text-sm font-medium text-slate-800">{role}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-xs text-muted-foreground">
                    Curriculum · Skills · Placement assistance
                  </span>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal/80"
                  >
                    View course
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
