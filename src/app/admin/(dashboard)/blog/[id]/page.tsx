import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader } from "@/components/admin/primitives";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Post · VertexIT Admin",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("CONTENT_EDITOR");

  const { id } = await params;

  const [post, categories, courses] = await Promise.all([
    db.blogPost.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
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

  if (!post) notFound();

  const initial = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage ?? "",
    categoryId: post.categoryId ?? "",
    author: post.author,
    tags: post.tags,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    canonicalUrl: post.canonicalUrl ?? "",
    ogTitle: post.ogTitle ?? "",
    ogDescription: post.ogDescription ?? "",
    ogImage: post.ogImage ?? "",
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : "",
    isPublished: post.isPublished,
    isDemo: post.isDemo,
    courseId: post.courseId ?? "",
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Post"
        description={
          post.isPublished
            ? "Published post. Edit and re-save to update."
            : "Draft post. Publish when ready."
        }
        backHref="/admin/blog"
      />
      <BlogForm categories={categories} courses={courses} initial={initial} />
    </div>
  );
}
