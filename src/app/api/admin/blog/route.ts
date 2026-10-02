import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { blogPostSchema } from "@/lib/admin-content-schemas";

// ============================================================
// GET /api/admin/blog — list all blog posts (most recent first)
// ============================================================
export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  try {
    const posts = await db.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
    return ok({ posts });
  } catch (e) {
    console.error("[api/admin/blog] list error:", e);
    return fail("Unable to load blog posts right now.", 500);
  }
}

// ============================================================
// POST /api/admin/blog — create a new blog post
// ============================================================
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const { data, error: validationError } = parseBody(blogPostSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    // Enforce slug uniqueness
    const existing = await db.blogPost.findUnique({ where: { slug: data.slug }, select: { id: true } });
    if (existing) {
      return fail("A post with this slug already exists. Please choose a unique slug.", 409);
    }

    // Validate categoryId if provided
    let categoryId: string | null = null;
    if (data.categoryId) {
      const cat = await db.blogCategory.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });
      if (cat) categoryId = cat.id;
    }

    // Validate courseId if provided
    let courseId: string | null = null;
    if (data.courseId) {
      const course = await db.course.findUnique({
        where: { id: data.courseId },
        select: { id: true },
      });
      if (course) courseId = course.id;
    }

    const publishedAt = data.isPublished
      ? (data.publishedAt ?? new Date())
      : data.publishedAt ?? null;

    const post = await db.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        featuredImage: data.featuredImage ?? null,
        categoryId,
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
        courseId,
      },
    });

    await withAudit(user, "CREATE_BLOG", "BlogPost", post.id, {
      title: post.title,
      slug: post.slug,
      isPublished: post.isPublished,
    });

    return ok({ id: post.id });
  } catch (e) {
    console.error("[api/admin/blog] create error:", e);
    return fail("We couldn't save the post. Please try again.", 500);
  }
}
