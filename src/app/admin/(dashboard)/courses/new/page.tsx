import { AdminPageHeader } from "@/components/admin/primitives";
import { CourseForm } from "@/components/admin/course-form";

export const dynamic = "force-dynamic";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Course"
        description="Create a new VertexIT training programme. Publish when you're ready."
        backHref="/admin/courses"
      />
      <CourseForm />
    </div>
  );
}
