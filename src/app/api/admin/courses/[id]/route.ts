import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { courseSchema } from "@/lib/admin-content-schemas";

// ============================================================
// GET /api/admin/courses/[id] — single course with relations
// (modules, outcomes, faqs) for the edit form.
// ============================================================
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await ctx.params;
  try {
    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: { orderBy: { sortOrder: "asc" } },
        outcomes: { orderBy: { sortOrder: "asc" } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!course) return fail("Course not found", 404);
    return ok({ course });
  } catch (e) {
    console.error("[api/admin/courses/[id]] get error:", e);
    return fail("Unable to load this course.", 500);
  }
}

// ============================================================
// PUT /api/admin/courses/[id] — update a course.
// Modules / outcomes / faqs are REPLACE-ALL: we delete every
// existing child row and recreate them from the array payload.
// Wrapped in a transaction so the course never ends up
// half-edited if a child write fails.
// ============================================================
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const { data, error: validationError } = parseBody(courseSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.course.findUnique({
      where: { id },
      select: { id: true, slug: true, isPublished: true },
    });
    if (!existing) return fail("Course not found", 404);

    // Enforce slug uniqueness (excluding this record)
    if (data.slug !== existing.slug) {
      const clash = await db.course.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });
      if (clash) {
        return fail("A course with this slug already exists. Please choose a unique slug.", 409);
      }
    }

    const wasPublished = existing.isPublished;
    const nowPublished = data.isPublished;

    // Replace-all relations inside a single transaction.
    const [updated] = await db.$transaction([
      db.courseModule.deleteMany({ where: { courseId: id } }),
      db.courseOutcome.deleteMany({ where: { courseId: id } }),
      db.courseFaq.deleteMany({ where: { courseId: id } }),
      db.course.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          shortDescription: data.shortDescription,
          introduction: data.introduction ?? "",
          whoFor: data.whoFor ?? "",
          whatYouLearn: data.whatYouLearn ?? "",
          practicalLearning: data.practicalLearning ?? "",
          caseStudies: data.caseStudies ?? "",
          careerRoles: data.careerRoles ?? "",
          placementAssistance: data.placementAssistance ?? "",
          trainingMode: data.trainingMode,
          eligibility: data.eligibility ?? "",
          keySkills: data.keySkills ?? "",
          careerPathways: data.careerPathways ?? "",
          duration: data.duration ?? null,
          batchSchedule: data.batchSchedule ?? null,
          courseFee: data.courseFee ?? null,
          status: data.status,
          featuredImage: data.featuredImage ?? null,
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          canonicalUrl: data.canonicalUrl ?? null,
          ogTitle: data.ogTitle ?? null,
          ogDescription: data.ogDescription ?? null,
          ogImage: data.ogImage ?? null,
          isPublished: nowPublished,
          isDemo: data.isDemo,
          displayOrder: data.displayOrder,
          modules: {
            create: data.modules.map((m, i) => ({
              title: m.title,
              description: m.description ?? "",
              sortOrder: i,
            })),
          },
          outcomes: {
            create: data.outcomes.map((o, i) => ({ text: o.text, sortOrder: i })),
          },
          faqs: {
            create: data.faqs.map((f, i) => ({
              question: f.question,
              answer: f.answer,
              sortOrder: i,
            })),
          },
        },
      }),
    ]);

    await withAudit(user, "UPDATE_COURSE", "Course", updated.id, {
      title: updated.title,
      slug: updated.slug,
      isPublished: updated.isPublished,
      modules: data.modules.length,
      outcomes: data.outcomes.length,
      faqs: data.faqs.length,
    });

    // Notify on publish transition (unpublished → published)
    if (!wasPublished && nowPublished) {
      await db.adminNotification
        .create({
          data: {
            type: "SYSTEM",
            title: `Course published: ${updated.title}`,
            message: `${data.modules.length} module(s) · ${data.outcomes.length} outcome(s)`,
            link: `/admin/courses/${updated.id}`,
          },
        })
        .catch(() => undefined);
    }

    return ok({ id: updated.id });
  } catch (e) {
    console.error("[api/admin/courses/[id]] update error:", e);
    return fail("We couldn't update the course. Please try again.", 500);
  }
}

// ============================================================
// DELETE /api/admin/courses/[id] — remove the course.
// CourseModule / CourseOutcome / CourseFaq cascade-delete via
// Prisma onDelete: Cascade (configured in schema).
// ============================================================
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const { id } = await ctx.params;
  try {
    const existing = await db.course.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true },
    });
    if (!existing) return fail("Course not found", 404);

    await db.course.delete({ where: { id } });

    await withAudit(user, "DELETE_COURSE", "Course", id, {
      title: existing.title,
      slug: existing.slug,
    });

    return ok({ id });
  } catch (e) {
    console.error("[api/admin/courses/[id]] delete error:", e);
    return fail("We couldn't delete this course. Please try again.", 500);
  }
}
