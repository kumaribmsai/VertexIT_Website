import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { sanitizeText } from "@/lib/validations";

const placementStorySchema = z.object({
  studentName: z.string().min(2, "Student name is required").max(120),
  course: z.string().max(160).optional().nullable(),
  previousBackground: z.string().max(500).optional().nullable(),
  newRole: z.string().max(200).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  package: z.string().max(120).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  year: z.coerce.number().int().min(1990).max(2100).optional().nullable(),
  shortStory: z.string().max(4000).optional().default(""),
  quote: z.string().max(2000).optional().nullable(),
  offerLetterImage: z.string().max(1000).optional().nullable(),
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

  const { data, error: validationError } = parseBody(placementStorySchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.placementStory.findUnique({ where: { id } });
    if (!existing) return fail("Placement story not found", 404);
    const s = await db.placementStory.update({
      where: { id },
      data: {
        studentName: sanitizeText(data.studentName),
        course: data.course ? sanitizeText(data.course) : null,
        previousBackground: data.previousBackground ? sanitizeText(data.previousBackground) : null,
        newRole: data.newRole ? sanitizeText(data.newRole) : null,
        company: data.company ? sanitizeText(data.company) : null,
        package: data.package ? sanitizeText(data.package) : null,
        location: data.location ? sanitizeText(data.location) : null,
        year: data.year ?? null,
        shortStory: sanitizeText(data.shortStory ?? ""),
        quote: data.quote ? sanitizeText(data.quote) : null,
        offerLetterImage: data.offerLetterImage ?? null,
        photo: data.photo ?? null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        isDemo: data.isDemo,
      },
    });
    await withAudit(user, "UPDATE_PLACEMENT_STORY", "PlacementStory", s.id, { studentName: s.studentName });
    return ok({ story: s });
  } catch (e) {
    console.error("[api/admin/placement-stories] PUT error:", e);
    return fail("Couldn't update the placement story. Please try again.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  try {
    const existing = await db.placementStory.findUnique({ where: { id } });
    if (!existing) return fail("Placement story not found", 404);
    await db.placementStory.delete({ where: { id } });
    await withAudit(user, "DELETE_PLACEMENT_STORY", "PlacementStory", id, { studentName: existing.studentName });
    return ok();
  } catch (e) {
    console.error("[api/admin/placement-stories] DELETE error:", e);
    return fail("Couldn't delete the placement story. Please try again.", 500);
  }
}
