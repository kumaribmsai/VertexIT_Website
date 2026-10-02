import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader, AdminCard, AdminEmpty, AdminBadge } from "@/components/admin/primitives";
import { AdminJobActions } from "@/components/admin/job-actions";
import { Plus, Briefcase, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jobs · VertexIT Admin",
  robots: { index: false, follow: false },
};

export default async function AdminJobsPage() {
  await requireAdmin("CONTENT_EDITOR");

  const [jobs, publishedCount, totalCount] = await Promise.all([
    db.job.findMany({
      orderBy: [{ postedDate: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        company: true,
        location: true,
        experience: true,
        jobType: true,
        workMode: true,
        postedDate: true,
        isPublished: true,
        isExpired: true,
        isDemo: true,
      },
    }),
    db.job.count({ where: { isPublished: true, isExpired: false } }),
    db.job.count(),
  ]);

  const draftCount = totalCount - publishedCount;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Jobs"
        description="Manage open mortgage and lending positions."
        actions={
          <Link
            href="/admin/jobs/new"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-navy px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            New Job
          </Link>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Published</p>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-teal/10 text-teal">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{publishedCount}</p>
          <p className="text-xs text-muted-foreground">visible on the public site</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Drafts</p>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-700">
              <Briefcase className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{draftCount}</p>
          <p className="text-xs text-muted-foreground">unpublished or expired</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total</p>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-navy/10 text-navy">
              <Briefcase className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{totalCount}</p>
          <p className="text-xs text-muted-foreground">all jobs in the system</p>
        </div>
      </div>

      {/* Jobs table */}
      <AdminCard
        title="All Jobs"
        description={`${publishedCount} published · ${totalCount} total`}
        className="overflow-hidden"
      >
        {jobs.length === 0 ? (
          <AdminEmpty message="No jobs yet. Click ‘New Job’ to create your first one." />
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Mode</th>
                  <th className="px-5 py-3 font-medium">Experience</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Posted</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        className="font-medium text-navy hover:text-teal"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[0.7rem] text-slate-400">/{job.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {job.company || <span className="text-muted-foreground italic">Confidential</span>}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{job.location || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="text-slate-700">{job.workMode}</span>
                      <span className="block text-[0.7rem] text-slate-400">{job.jobType}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-700">{job.experience || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {job.isPublished && !job.isExpired ? (
                          <AdminBadge tone="green">Published</AdminBadge>
                        ) : job.isExpired ? (
                          <AdminBadge tone="red">Expired</AdminBadge>
                        ) : (
                          <AdminBadge tone="amber">Draft</AdminBadge>
                        )}
                        {job.isDemo && <AdminBadge tone="teal">Demo</AdminBadge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <p>{format(new Date(job.postedDate), "d MMM yyyy")}</p>
                      <p className="text-[0.7rem] text-slate-400">
                        {format(new Date(job.postedDate), "h:mm a")}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <AdminJobActions jobId={job.id} title={job.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
