import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Post · VertexIT Admin",
  robots: { index: false, follow: false },
};

export default async function NewBlogPostPage() {
  await requireAdmin("CONTENT_EDITOR");

  const [categories, courses] = await Promise.all([
    db.blogCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
    db.course.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, slug: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Post"
        description="Write a new blog article. Save as draft or publish when ready."
        backHref="/admin/blog"
      />
      <BlogForm categories={categories} courses={courses} />
    </div>
  );
}
