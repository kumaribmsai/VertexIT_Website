import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";

// ============================================================
// GET /api/admin/blog/categories — list all blog categories
// Used to populate the category select in the blog post form.
// ============================================================
export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  try {
    const categories = await db.blogCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        sortOrder: true,
      },
    });
    return ok({ categories });
  } catch (e) {
    console.error("[api/admin/blog/categories] list error:", e);
    return fail("Unable to load blog categories right now.", 500);
  }
}
