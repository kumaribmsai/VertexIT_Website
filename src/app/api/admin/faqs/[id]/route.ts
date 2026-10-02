import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { sanitizeText } from "@/lib/validations";

const faqSchema = z.object({
  question: z.string().min(2, "Question is required").max(500),
  answer: z.string().min(2, "Answer is required").max(4000),
  category: z.string().min(1).max(120).default("General"),
  sortOrder: z.coerce.number().int().min(0).max(10000).default(0),
  isPublished: z.boolean().default(true),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(faqSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.faq.findUnique({ where: { id } });
    if (!existing) return fail("FAQ not found", 404);
    const f = await db.faq.update({
      where: { id },
      data: {
        question: sanitizeText(data.question),
        answer: sanitizeText(data.answer),
        category: sanitizeText(data.category),
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      },
    });
    await withAudit(user, "UPDATE_FAQ", "Faq", f.id, { question: f.question });
    return ok({ faq: f });
  } catch (e) {
    console.error("[api/admin/faqs] PUT error:", e);
    return fail("Couldn't update the FAQ. Please try again.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  try {
    const existing = await db.faq.findUnique({ where: { id } });
    if (!existing) return fail("FAQ not found", 404);
    await db.faq.delete({ where: { id } });
    await withAudit(user, "DELETE_FAQ", "Faq", id, { question: existing.question });
    return ok();
  } catch (e) {
    console.error("[api/admin/faqs] DELETE error:", e);
    return fail("Couldn't delete the FAQ. Please try again.", 500);
  }
}
