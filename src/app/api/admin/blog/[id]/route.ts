import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { blogPostSchema } from "@/lib/admin-content-schemas";

// ============================================================
// GET /api/admin/blog/[id] — fetch a single blog post
// ============================================================
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await ctx.params;
  try {
    const post = await db.blogPost.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!post) return fail("Post not found", 404);
    return ok({ post });
  } catch (e) {
    console.error("[api/admin/blog/[id]] get error:", e);
    return fail("Unable to load this post.", 500);
  }
}

// ============================================================
// PUT /api/admin/blog/[id] — update a blog post
// ============================================================
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const { data, error: validationError } = parseBody(blogPostSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.blogPost.findUnique({
      where: { id },
      select: { id: true, slug: true, isPublished: true, publishedAt: true },
    });
    if (!existing) return fail("Post not found", 404);

    // Enforce slug uniqueness (excluding this record)
    if (data.slug !== existing.slug) {
      const clash = await db.blogPost.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });
      if (clash) {
        return fail("A post with this slug already exists. Please choose a unique slug.", 409);
      }
    }

    // Validate categoryId if provided
    let categoryId: string | null | undefined = undefined;
    if (data.categoryId) {
      const cat = await db.blogCategory.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });
      if (cat) categoryId = cat.id;
      else categoryId = null;
    } else if (data.categoryId === null) {
      categoryId = null;
    }

    // Validate courseId if provided
    let courseId: string | null | undefined = undefined;
    if (data.courseId) {
      const course = await db.course.findUnique({
        where: { id: data.courseId },
        select: { id: true },
      });
      if (course) courseId = course.id;
      else courseId = null;
    } else if (data.courseId === null) {
      courseId = null;
    }

    // If transitioning to published and no publishedAt set, stamp now.
    let publishedAt: Date | null;
    if (data.isPublished) {
      publishedAt = data.publishedAt ?? existing.publishedAt ?? new Date();
    } else {
      publishedAt = data.publishedAt ?? existing.publishedAt;
    }

    const updated = await db.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        featuredImage: data.featuredImage ?? null,
        ...(categoryId !== undefined ? { categoryId } : {}),
        author: data.author || "VertexIT",
        tags: data.tags ?? "",
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        canonicalUrl: data.canonicalUrl ?? null,
        ogTitle: data.ogTitle ?? null,
        ogDescription: data.ogDescription ?? null,
        ogImage: data.ogImage ?? null,
        publishedAt,
        isPublished: data.isPublished,
        isDemo: data.isDemo,
        ...(courseId !== undefined ? { courseId } : {}),
      },
    });

    await withAudit(user, "UPDATE_BLOG", "BlogPost", updated.id, {
      title: updated.title,
      slug: updated.slug,
      isPublished: updated.isPublished,
    });

    return ok({ id: updated.id });
  } catch (e) {
    console.error("[api/admin/blog/[id]] update error:", e);
    return fail("We couldn't update the post. Please try again.", 500);
  }
}

// ============================================================
// DELETE /api/admin/blog/[id] — delete a blog post
// ============================================================
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const { id } = await ctx.params;
  try {
    const existing = await db.blogPost.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true },
    });
    if (!existing) return fail("Post not found", 404);

    await db.blogPost.delete({ where: { id } });

    await withAudit(user, "DELETE_BLOG", "BlogPost", id, {
      title: existing.title,
      slug: existing.slug,
    });

    return ok({ id });
  } catch (e) {
    console.error("[api/admin/blog/[id]] delete error:", e);
    return fail("We couldn't delete this post.", 500);
  }
}
