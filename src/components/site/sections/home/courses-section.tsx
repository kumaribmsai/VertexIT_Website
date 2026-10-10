import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedCourses } from "@/services/public";
import { CourseCard } from "@/components/site/course-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/state";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/site/buttons";

export async function HomeCourses() {
  let courses: Awaited<ReturnType<typeof getPublishedCourses>> = [];
  let waHref = "#";
  try {
    [courses, waHref] = await Promise.all([
      getPublishedCourses(),
      whatsappUrl("generic"),
    ]);
  } catch {
    /* graceful */
  }

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Programs"
          title="Career-focused IT programs"
          description="Practical, job-oriented training designed for graduates, experienced professionals, and career switchers entering the IT industry."
        />

        <div className="mt-12">
          {courses.length === 0 ? (
            <EmptyState
              title="Programs are being finalised"
              description="Our course catalog will be published shortly. Speak with a counsellor to get early access and batch details."
              action={<WhatsAppButton href={waHref}>Speak with a counsellor</WhatsAppButton>}
            />
          ) : (
            <div
              className={
                courses.length > 1
                  ? "grid gap-6 sm:grid-cols-2"
                  : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              }
            >
              {courses.map((c, i) => (
                <Reveal key={c.id} delay={i * 80} className="h-full">
                  <CourseCard course={c} className="h-full" />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {courses.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-semibold text-navy transition-all hover:border-teal hover:text-teal"
            >
              Explore All Courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
