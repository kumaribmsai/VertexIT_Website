import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export type CourseCardData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  trainingMode: string;
  eligibility: string;
  keySkills: string;
  careerPathways: string;
  duration: string | null;
  featuredImage: string | null;
};

function splitList(input: string): string[] {
  if (!input) return [];
  return input
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function CourseCard({ course, className }: { course: CourseCardData; className?: string }) {
  const skills = splitList(course.keySkills);
  const pathways = splitList(course.careerPathways);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-teal/40 hover:shadow-[0_18px_40px_-18px_rgba(11,37,69,0.25)]",
        className,
      )}
    >
      {/* Top media */}
      <Link href={`/courses/${course.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-navy">
        {course.featuredImage ? (
          <Image
            src={course.featuredImage}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-gradient" />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-navy backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" /> {course.trainingMode}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy/80 px-2.5 py-1 text-[0.65rem] font-medium text-white backdrop-blur">
          <Clock className="h-3 w-3" /> {course.duration ? course.duration : "TBC"}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-navy">
          <Link href={`/courses/${course.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {course.shortDescription}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-md bg-teal/8 px-2 py-0.5 text-[0.7rem] font-medium text-teal"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Meta footer */}
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-[0.7rem] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5 text-teal" />
            {course.eligibility || "Any graduate"}
          </span>
          {pathways.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-teal" />
              {pathways.length}+ roles
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal group-hover:gap-1.5 transition-all">
            View Course <ArrowRight className="h-4 w-4" />
          </span>
          <Link
            href="/apply"
            className="relative z-10 rounded-full border border-navy/15 px-3 py-1 text-[0.7rem] font-semibold text-navy transition-colors hover:border-teal hover:text-teal"
          >
            Talk to Counsellor
          </Link>
        </div>
      </div>
    </article>
  );
}
