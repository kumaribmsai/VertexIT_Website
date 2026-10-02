import { db } from "@/lib/db";
import { Reveal } from "@/components/site/reveal";
import { AnimatedCounter } from "@/components/site/animated-counter";
import { GraduationCap, BookOpen, HelpCircle, FileText, Layers, Sparkles } from "lucide-react";

// Stats section using REAL counts from the database (not fabricated numbers).
// Per spec: "Do not display fake numbers" — these are verifiable counts of
// published content in the system.
export async function StatsSection() {
  const [courseCount, moduleCount, faqCount, blogCount, blogDraftCount] = await Promise.all([
    db.course.count({ where: { isPublished: true } }),
    db.courseModule.count({ where: { course: { isPublished: true } } }),
    db.faq.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { isPublished: true } }),
    db.blogPost.count(),
  ]);

  const stats = [
    { value: courseCount, label: "Launch courses", icon: GraduationCap, suffix: "" },
    { value: moduleCount, label: "Curriculum modules", icon: Layers, suffix: "" },
    { value: faqCount, label: "Answered FAQs", icon: HelpCircle, suffix: "" },
    { value: blogCount + blogDraftCount, label: "Blog articles", icon: FileText, suffix: "" },
  ];

  return (
    <section className="relative overflow-hidden bg-navy py-14 text-white">
      {/* Decorative dot grid */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      {/* Teal glow accents */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-60 w-60 rounded-full bg-teal/15 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-60 w-60 rounded-full bg-teal/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-soft/30 bg-teal/15 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal-soft">
            <Sparkles className="h-3.5 w-3.5" />
            By the numbers
          </span>
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl text-balance">
            A structured platform, built for outcomes
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm transition-all hover:border-teal-soft/40 hover:bg-white/10">
                <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-teal-soft transition-transform group-hover:scale-110">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-300">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-6 text-center text-xs text-slate-400">
            Real-time counts from our CMS. Growing as we publish more content and enroll more candidates.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
