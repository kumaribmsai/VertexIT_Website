import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { JobForm } from "@/components/admin/job-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Job · VertexIT Admin",
  robots: { index: false, follow: false },
};

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("CONTENT_EDITOR");

  const { id } = await params;

  const [job, courses] = await Promise.all([
    db.job.findUnique({
      where: { id },
      include: {
        _count: { select: { applications: true } },
      },
    }),
    db.course.findMany({
      where: { isPublished: true },
      select: { slug: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  if (!job) notFound();

  // Serialise dates for client usage.
  const initial = {
    id: job.id,
    title: job.title,
    slug: job.slug,
    company: job.company,
    location: job.location,
    experience: job.experience,
    salary: job.salary ?? "",
    jobType: job.jobType,
    workMode: job.workMode,
    courseDomain: job.courseDomain ?? "",
    skills: job.skills,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    description: job.description,
    postedDate: job.postedDate.toISOString(),
    closingDate: job.closingDate ? job.closingDate.toISOString().slice(0, 10) : "",
    isPublished: job.isPublished,
    isExpired: job.isExpired,
    isDemo: job.isDemo,
    metaTitle: job.metaTitle ?? "",
    metaDescription: job.metaDescription ?? "",
    applicationCount: job._count.applications,
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Job"
        description={initial.applicationCount > 0
          ? `${initial.applicationCount} application${initial.applicationCount === 1 ? "" : "s"} received for this role.`
          : "Update this job listing."}
        backHref="/admin/jobs"
      />
      <JobForm courses={courses} initial={initial} />
    </div>
  );
}
