import Link from "next/link";
import { getPublishedCourses } from "@/services/public";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

// Always-on curriculum preview — pulls module highlights from published courses.
// This section always has content because courses are seeded at launch.
export async function CurriculumPreview() {
  const courses = await getPublishedCourses();
  if (courses.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-slate-50/80 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Curriculum Preview"
          title="What you'll actually learn"
          description="Structured, practical curricula built around real mortgage and lending operations workflows — not theory-heavy lectures."
        />

        <div className={`mt-12 grid gap-6 ${courses.length >= 2 ? "lg:grid-cols-2" : "mx-auto max-w-2xl"}`}>
          {courses.map((course, idx) => {
            const modules = course.modules.slice(0, 6);
            const remaining = course.modules.length - modules.length;
            return (
              <Reveal key={course.id} delay={idx * 100}>
                <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 card-hover hover:border-teal/40">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-teal/8 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-teal">
                      <Layers className="h-3 w-3" />
                      {course.trainingMode}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      {course.modules.length} modules
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-lg font-bold text-navy">
                    {course.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {course.shortDescription}
                  </p>

                  <ol className="mt-5 space-y-2.5">
                    {modules.map((m, i) => (
                      <li key={m.id} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy/5 font-heading text-[0.7rem] font-bold text-navy">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-navy leading-tight">{m.title}</p>
                          {m.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{m.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>

                  {remaining > 0 && (
                    <p className="mt-3 text-xs text-slate-500">
                      +{remaining} more modules in the full curriculum
                    </p>
                  )}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal transition-all group-hover:gap-2"
                    >
                      View full curriculum <ArrowRight className="h-4 w-4" />
                    </Link>
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
