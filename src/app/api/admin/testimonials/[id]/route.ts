import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { sanitizeText } from "@/lib/validations";

const testimonialSchema = z.object({
  studentName: z.string().min(2, "Student name is required").max(120),
  course: z.string().max(160).optional().nullable(),
  quote: z.string().min(2, "Quote is required").max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  photo: z.string().max(1000).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
  isPublished: z.boolean().default(false),
  isDemo: z.boolean().default(false),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(testimonialSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) return fail("Testimonial not found", 404);
    const t = await db.testimonial.update({
      where: { id },
      data: {
        studentName: sanitizeText(data.studentName),
        course: data.course ? sanitizeText(data.course) : null,
        quote: sanitizeText(data.quote),
        rating: data.rating,
        photo: data.photo ?? null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        isDemo: data.isDemo,
      },
    });
    await withAudit(user, "UPDATE_TESTIMONIAL", "Testimonial", t.id, { studentName: t.studentName });
    return ok({ testimonial: t });
  } catch (e) {
    console.error("[api/admin/testimonials] PUT error:", e);
    return fail("Couldn't update the testimonial. Please try again.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  try {
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) return fail("Testimonial not found", 404);
    await db.testimonial.delete({ where: { id } });
    await withAudit(user, "DELETE_TESTIMONIAL", "Testimonial", id, { studentName: existing.studentName });
    return ok();
  } catch (e) {
    console.error("[api/admin/testimonials] DELETE error:", e);
    return fail("Couldn't delete the testimonial. Please try again.", 500);
  }
}
