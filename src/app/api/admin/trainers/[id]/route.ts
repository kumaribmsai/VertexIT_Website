import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { sanitizeText } from "@/lib/validations";

const trainerSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  designation: z.string().min(1, "Designation is required").max(160),
  experience: z.string().max(120).optional().nullable(),
  specialization: z.string().min(1, "Specialization is required").max(200),
  bio: z.string().max(4000).optional().default(""),
  photo: z.string().max(1000).optional().nullable(),
  linkedinUrl: z.string().max(1000).optional().nullable(),
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

  const { data, error: validationError } = parseBody(trainerSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.trainer.findUnique({ where: { id } });
    if (!existing) return fail("Trainer not found", 404);
    const trainer = await db.trainer.update({
      where: { id },
      data: {
        name: sanitizeText(data.name),
        designation: sanitizeText(data.designation),
        experience: data.experience ? sanitizeText(data.experience) : null,
        specialization: sanitizeText(data.specialization),
        bio: sanitizeText(data.bio ?? ""),
        photo: data.photo ?? null,
        linkedinUrl: data.linkedinUrl ?? null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        isDemo: data.isDemo,
      },
    });
    await withAudit(user, "UPDATE_TRAINER", "Trainer", trainer.id, { name: trainer.name });
    return ok({ trainer });
  } catch (e) {
    console.error("[api/admin/trainers] PUT error:", e);
    return fail("Couldn't update the trainer. Please try again.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  try {
    const existing = await db.trainer.findUnique({ where: { id } });
    if (!existing) return fail("Trainer not found", 404);
    await db.trainer.delete({ where: { id } });
    await withAudit(user, "DELETE_TRAINER", "Trainer", id, { name: existing.name });
    return ok();
  } catch (e) {
    console.error("[api/admin/trainers] DELETE error:", e);
    return fail("Couldn't delete the trainer. Please try again.", 500);
  }
}
