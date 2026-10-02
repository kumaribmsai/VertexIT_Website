import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCourses } from "@/services/public";
import { buildPageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { CourseCard } from "@/components/site/course-card";
import { EmptyState } from "@/components/site/state";
import { Reveal } from "@/components/site/reveal";
import { WhatsAppButton, LinkButton } from "@/components/site/buttons";
import { LifeBuoy } from "lucide-react";

export const metadata: Metadata = await buildPageMetadata({
  title: "Mortgage Training Courses | VertexIT",
  description:
    "Career-focused mortgage training programs in Bengaluru. US Mortgage Underwriting and Australia Mortgage Operations — practical, job-ready curriculum for graduates and career switchers.",
  path: "/courses",
});

export default async function CoursesPage() {
  const [courses, waHref] = await Promise.all([
    getPublishedCourses(),
    whatsappUrl("generic", "Hi VertexIT, I'm not sure which course is right for me. Can I speak with a counsellor?"),
  ]);

  return (
    <div className="bg-white">
      {/* Hero / heading band */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
          <div className="mt-8">
            <SectionHeading
              align="left"
              eyebrow="OUR PROGRAMS"
              title="Mortgage Training Programs"
              description="Practical, career-focused programs built around real mortgage workflows. Each course blends concept, hands-on file practice and case-study based learning — designed to help you become job-ready for mortgage and lending operations roles."
            />
          </div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {courses.length === 0 ? (
          <EmptyState
            title="No courses published yet"
            description="Our course catalogue is being finalised. Please check back shortly or speak to a counsellor to learn more about the upcoming batches."
            icon={LifeBuoy}
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <WhatsAppButton href={waHref}>Talk to a Counsellor</WhatsAppButton>
                <LinkButton href="/contact" variant="outline">
                  Contact Us
                </LinkButton>
              </div>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {courses.map((course, i) => (
              <Reveal key={course.id} delay={i * 80}>
                <CourseCard course={course} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}

        {/* Counsellor CTA */}
        <div className="mt-14 sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-navy px-6 py-8 sm:px-10 sm:py-10">
            <div className="bg-dot-grid absolute inset-0 opacity-25" aria-hidden />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-teal-soft">
                  Need help choosing?
                </p>
                <h2 className="mt-2 font-heading text-xl font-bold text-white sm:text-2xl">
                  Not sure which course is right for you? Talk to a counsellor
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Our counsellors will understand your background and goals, and recommend the program that fits you best — no pressure.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <LinkButton href="/apply" variant="default">
                  Talk to a Counsellor
                </LinkButton>
                <WhatsAppButton href={waHref} variant="outline">
                  WhatsApp Us
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>

        {/* Helper links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>Learn more:</span>
          <Link href="/placement-process" className="font-medium text-teal hover:text-teal/80">
            Placement Process
          </Link>
          <Link href="/jobs" className="font-medium text-teal hover:text-teal/80">
            Current Openings
          </Link>
          <Link href="/blog" className="font-medium text-teal hover:text-teal/80">
            Career Insights
          </Link>
          <Link href="/contact" className="font-medium text-teal hover:text-teal/80">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
