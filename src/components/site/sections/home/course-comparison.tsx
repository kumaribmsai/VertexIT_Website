import Link from "next/link";
import { getPublishedCourses } from "@/services/public";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { ArrowRight, Check, X } from "lucide-react";

// US vs Australia IT Training comparison — always has data because both
// launch courses are seeded. Helps candidates decide which path fits.
export async function CourseComparison() {
  const courses = await getPublishedCourses();
  if (courses.length < 2) return null;

  const [us, au] = courses;
  const usSkills = us.keySkills.split("\n").filter(Boolean);
  const auSkills = au.keySkills.split("\n").filter(Boolean);
  const usRoles = us.careerPathways.split("\n").filter(Boolean);
  const auRoles = au.careerPathways.split("\n").filter(Boolean);

  const rows = [
    { label: "Focus area", us: us.shortDescription.slice(0, 80) + "…", au: au.shortDescription.slice(0, 80) + "…" },
    { label: "Training mode", us: us.trainingMode, au: au.trainingMode },
    { label: "Modules", us: `${us.modules.length} modules`, au: `${au.modules.length} modules` },
    { label: "Key skills", us: usSkills[0] || "—", au: auSkills[0] || "—" },
    { label: "Career pathway", us: usRoles[0] || "—", au: auRoles[0] || "—" },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Compare Programs"
          title="US IT vs Australia IT"
          description="Two distinct career paths in global IT operations. Pick the one that aligns with your goals — or speak with a counsellor to decide."
        />

        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-navy text-white">
              <div className="px-4 py-5 sm:px-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                  Compare
                </span>
                <p className="mt-1 font-heading text-sm font-bold sm:text-base">Program details</p>
              </div>
              <div className="border-l border-white/10 px-4 py-5 sm:px-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                  Program 01
                </span>
                <p className="mt-1 font-heading text-sm font-bold leading-tight sm:text-base">
                  {us.title}
                </p>
              </div>
              <div className="border-l border-white/10 px-4 py-5 sm:px-6">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-teal-soft">
                  Program 02
                </span>
                <p className="mt-1 font-heading text-sm font-bold leading-tight sm:text-base">
                  {au.title}
                </p>
              </div>
            </div>

            {/* Body rows */}
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}
              >
                <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:px-6 sm:text-sm">
                  {row.label}
                </div>
                <div className="border-l border-slate-100 px-4 py-4 text-xs text-navy sm:px-6 sm:text-sm">
                  {row.us}
                </div>
                <div className="border-l border-slate-100 px-4 py-4 text-xs text-navy sm:px-6 sm:text-sm">
                  {row.au}
                </div>
              </div>
            ))}

            {/* CTA row */}
            <div className="grid grid-cols-3 border-t border-slate-100 bg-white">
              <div className="px-4 py-4 sm:px-6">
                <span className="text-xs font-semibold text-muted-foreground">Explore</span>
              </div>
              <div className="border-l border-slate-100 px-4 py-4 sm:px-6">
                <Link
                  href={`/courses/${us.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:gap-1.5 transition-all sm:text-sm"
                >
                  US course <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="border-l border-slate-100 px-4 py-4 sm:px-6">
                <Link
                  href={`/courses/${au.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:gap-1.5 transition-all sm:text-sm"
                >
                  AU course <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Check className="mr-1 inline h-3.5 w-3.5 text-teal" />
            Both programs include placement assistance, interview preparation and career support.
            <X className="mx-1 inline h-3.5 w-3.5 text-slate-300" />
            Neither program guarantees employment — actual hiring depends on employer requirements and candidate suitability.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
