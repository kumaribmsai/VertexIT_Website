import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { courseSchema } from "@/lib/admin-content-schemas";

// ============================================================
// GET /api/admin/courses — list all courses (admin only).
// Returns published AND unpublished records, newest first.
// ============================================================
export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  try {
    const courses = await db.course.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        trainingMode: true,
        status: true,
        isPublished: true,
        isDemo: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { modules: true } },
      },
    });
    return ok({ courses });
  } catch (e) {
    console.error("[api/admin/courses] list error:", e);
    return fail("Unable to load courses right now.", 500);
  }
}

// ============================================================
// POST /api/admin/courses — create a new course with nested
// modules / outcomes / faqs (single transactional write).
// ============================================================
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const { data, error: validationError } = parseBody(courseSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    // Enforce slug uniqueness
    const existing = await db.course.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });
    if (existing) {
      return fail("A course with this slug already exists. Please choose a unique slug.", 409);
    }

    const course = await db.course.create({
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
        isPublished: data.isPublished,
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
    });

    await withAudit(user, "CREATE_COURSE", "Course", course.id, {
      title: course.title,
      slug: course.slug,
      isPublished: course.isPublished,
      modules: data.modules.length,
      outcomes: data.outcomes.length,
      faqs: data.faqs.length,
    });

    if (course.isPublished) {
      await db.adminNotification
        .create({
          data: {
            type: "SYSTEM",
            title: `Course published: ${course.title}`,
            message: `${data.modules.length} module(s) · ${data.outcomes.length} outcome(s)`,
            link: `/admin/courses/${course.id}`,
          },
        })
        .catch(() => undefined);
    }

    return ok({ id: course.id });
  } catch (e) {
    console.error("[api/admin/courses] create error:", e);
    return fail("We couldn't save the course. Please try again.", 500);
  }
}
