import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Clock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export type JobCardData = {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  experience: string;
  salary: string | null;
  jobType: string;
  workMode: string;
  postedDate: string | Date;
};

export function JobCard({ job, className }: { job: JobCardData; className?: string }) {
  const posted = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-teal/40 hover:shadow-[0_14px_30px_-14px_rgba(11,37,69,0.2)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy">
            <Briefcase className="h-4 w-4" />
          </span>
          <div>
            <span className="inline-flex items-center rounded-full bg-teal/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-teal">
              {job.workMode}
            </span>
            <p className="mt-0.5 text-[0.7rem] text-slate-500">{job.jobType}</p>
          </div>
        </div>
        <span className="text-[0.7rem] text-slate-400">{posted}</span>
      </div>

      <h3 className="mt-3 font-heading text-base font-bold leading-snug text-navy">
        <Link href={`/jobs/${job.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {job.title}
        </Link>
      </h3>
      {job.company && (
        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" /> {job.company}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-teal" /> {job.location || "Location TBC"}
        </span>
        {job.experience && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-teal" /> {job.experience}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-navy">
          {job.salary ? job.salary : "Salary: To be discussed"}
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal group-hover:gap-1.5 transition-all">
          Apply <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}
