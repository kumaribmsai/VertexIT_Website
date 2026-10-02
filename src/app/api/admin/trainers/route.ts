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

export async function GET() {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const trainers = await db.trainer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  void user;
  return ok({ trainers });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(trainerSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const trainer = await db.trainer.create({
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
    await withAudit(user, "CREATE_TRAINER", "Trainer", trainer.id, { name: trainer.name });
    return ok({ trainer });
  } catch (e) {
    console.error("[api/admin/trainers] POST error:", e);
    return fail("Couldn't create the trainer. Please try again.", 500);
  }
}
