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

export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const testimonials = await db.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok({ testimonials });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(testimonialSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const t = await db.testimonial.create({
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
    await withAudit(user, "CREATE_TESTIMONIAL", "Testimonial", t.id, { studentName: t.studentName });
    return ok({ testimonial: t });
  } catch (e) {
    console.error("[api/admin/testimonials] POST error:", e);
    return fail("Couldn't create the testimonial. Please try again.", 500);
  }
}
