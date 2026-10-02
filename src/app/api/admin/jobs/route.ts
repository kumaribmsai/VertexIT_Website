import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { jobSchema } from "@/lib/admin-content-schemas";

// ============================================================
// GET /api/admin/jobs — list all jobs (most recent first)
// ============================================================
export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  try {
    const jobs = await db.job.findMany({
      orderBy: [{ postedDate: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        company: true,
        location: true,
        experience: true,
        jobType: true,
        workMode: true,
        postedDate: true,
        closingDate: true,
        isPublished: true,
        isExpired: true,
        isDemo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return ok({ jobs });
  } catch (e) {
    console.error("[api/admin/jobs] list error:", e);
    return fail("Unable to load jobs right now.", 500);
  }
}

// ============================================================
// POST /api/admin/jobs — create a new job
// ============================================================
export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const { data, error: validationError } = parseBody(jobSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    // Enforce slug uniqueness
    const existing = await db.job.findUnique({ where: { slug: data.slug }, select: { id: true } });
    if (existing) {
      return fail("A job with this slug already exists. Please choose a unique slug.", 409);
    }

    // If a course slug/domain was provided, try to resolve a course link.
    let courseId: string | undefined;
    if (data.courseDomain) {
      const linked = await db.course.findUnique({
        where: { slug: data.courseDomain },
        select: { id: true },
      });
      if (linked) courseId = linked.id;
    }

    const job = await db.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        company: data.company ?? "",
        location: data.location ?? "",
        experience: data.experience ?? "",
        salary: data.salary ?? null,
        jobType: data.jobType,
        workMode: data.workMode,
        courseDomain: data.courseDomain ?? null,
        skills: data.skills ?? "",
        responsibilities: data.responsibilities ?? "",
        requirements: data.requirements ?? "",
        description: data.description ?? "",
        closingDate: data.closingDate ?? null,
        isPublished: data.isPublished,
        isExpired: data.isExpired,
        isDemo: data.isDemo,
        metaTitle: data.metaTitle ?? null,
        metaDescription: data.metaDescription ?? null,
        courseId,
        // postedDate defaults to now() in schema
      },
    });

    await withAudit(user, "CREATE_JOB", "Job", job.id, {
      title: job.title,
      slug: job.slug,
      isPublished: job.isPublished,
    });

    if (job.isPublished) {
      await db.adminNotification
        .create({
          data: {
            type: "JOB",
            title: `Job published: ${job.title}`,
            message: `${job.company || "Confidential"} · ${job.location || "Location TBC"}`,
            link: `/admin/jobs/${job.id}`,
          },
        })
        .catch(() => undefined);
    }

    return ok({ id: job.id });
  } catch (e) {
    console.error("[api/admin/jobs] create error:", e);
    return fail("We couldn't save the job. Please try again.", 500);
  }
}
