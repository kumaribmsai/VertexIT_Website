import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { JobForm } from "@/components/admin/job-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Job · VertexIT Admin",
  robots: { index: false, follow: false },
};

export default async function NewJobPage() {
  await requireAdmin("CONTENT_EDITOR");

  // Fetch published courses so the courseDomain select can be populated.
  const courses = await db.course.findMany({
    where: { isPublished: true },
    select: { slug: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Job"
        description="Create a new job listing. Save as draft or publish when ready."
        backHref="/admin/jobs"
      />
      <JobForm courses={courses} />
    </div>
  );
}
