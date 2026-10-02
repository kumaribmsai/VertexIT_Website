import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { jobSchema } from "@/lib/admin-content-schemas";

// ============================================================
// GET /api/admin/jobs/[id] — fetch a single job (full detail)
// ============================================================
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await ctx.params;
  try {
    const job = await db.job.findUnique({ where: { id } });
    if (!job) return fail("Job not found", 404);
    return ok({ job });
  } catch (e) {
    console.error("[api/admin/jobs/[id]] get error:", e);
    return fail("Unable to load this job.", 500);
  }
}

// ============================================================
// PUT /api/admin/jobs/[id] — update a job
// ============================================================
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body", 400);

  const { data, error: validationError } = parseBody(jobSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.job.findUnique({ where: { id }, select: { id: true, slug: true } });
    if (!existing) return fail("Job not found", 404);

    // Enforce slug uniqueness (excluding this record)
    if (data.slug !== existing.slug) {
      const clash = await db.job.findUnique({ where: { slug: data.slug }, select: { id: true } });
      if (clash) {
        return fail("A job with this slug already exists. Please choose a unique slug.", 409);
      }
    }

    // Resolve course link if courseDomain provided.
    let courseId: string | null | undefined = undefined;
    if (data.courseDomain) {
      const linked = await db.course.findUnique({
        where: { slug: data.courseDomain },
        select: { id: true },
      });
      courseId = linked?.id ?? null;
    } else if (data.courseDomain === null) {
      courseId = null;
    }

    const updated = await db.job.update({
      where: { id },
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
        ...(courseId !== undefined ? { courseId } : {}),
      },
    });

    await withAudit(user, "UPDATE_JOB", "Job", updated.id, {
      title: updated.title,
      slug: updated.slug,
      isPublished: updated.isPublished,
    });

    return ok({ id: updated.id });
  } catch (e) {
    console.error("[api/admin/jobs/[id]] update error:", e);
    return fail("We couldn't update the job. Please try again.", 500);
  }
}

// ============================================================
// DELETE /api/admin/jobs/[id] — delete a job
// (JobApplication records cascade-delete via Prisma onDelete: Cascade)
// ============================================================
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error || !user) return error ?? fail("Unauthorized", 401);

  const { id } = await ctx.params;
  try {
    const existing = await db.job.findUnique({ where: { id }, select: { id: true, title: true, slug: true } });
    if (!existing) return fail("Job not found", 404);

    await db.job.delete({ where: { id } });

    await withAudit(user, "DELETE_JOB", "Job", id, {
      title: existing.title,
      slug: existing.slug,
    });

    return ok({ id });
  } catch (e) {
    console.error("[api/admin/jobs/[id]] delete error:", e);
    return fail("We couldn't delete this job.", 500);
  }
}
