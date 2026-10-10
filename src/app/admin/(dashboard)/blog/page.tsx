import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminPageHeader, AdminCard, AdminEmpty, AdminBadge } from "@/components/admin/primitives";
import { AdminBlogActions } from "@/components/admin/blog-actions";
import { Plus, FileText, CheckCircle2, Edit3 } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog · VertexIT Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  await requireAdmin("CONTENT_EDITOR");

  const [posts, publishedCount, draftCount, totalCount] = await Promise.all([
    db.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    db.blogPost.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { isPublished: false } }),
    db.blogPost.count(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Posts"
        description="Publish career insights, course announcements and IT industry articles."
        actions={
          <Link
            href="/admin/blog/new"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-navy px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            New Post
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
          <p className="text-xs text-muted-foreground">live on the public blog</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Drafts</p>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-amber-100 text-amber-700">
              <Edit3 className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{draftCount}</p>
          <p className="text-xs text-muted-foreground">unpublished posts</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total</p>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-navy/10 text-navy">
              <FileText className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{totalCount}</p>
          <p className="text-xs text-muted-foreground">all posts in the system</p>
        </div>
      </div>

      {/* Posts table */}
      <AdminCard
        title="All Posts"
        description={`${publishedCount} published · ${draftCount} drafts`}
        className="overflow-hidden"
      >
        {posts.length === 0 ? (
          <AdminEmpty message="No posts yet. Click ‘New Post’ to create your first article." />
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Author</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Published</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="font-medium text-navy hover:text-teal"
                      >
                        {post.title}
                      </Link>
                      <p className="text-[0.7rem] text-slate-400">/{post.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {post.category ? (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[0.7rem] font-medium text-slate-700">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Uncategorised</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{post.author || "VertexIT"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.isPublished ? (
                          <AdminBadge tone="green">Published</AdminBadge>
                        ) : (
                          <AdminBadge tone="amber">Draft</AdminBadge>
                        )}
                        {post.isDemo && <AdminBadge tone="teal">Demo</AdminBadge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {post.publishedAt ? (
                        <span>{format(new Date(post.publishedAt), "d MMM yyyy")}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <span>{format(new Date(post.updatedAt), "d MMM yyyy")}</span>
                      <p className="text-[0.7rem] text-slate-400">
                        {format(new Date(post.updatedAt), "h:mm a")}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <AdminBlogActions postId={post.id} title={post.title} />
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
