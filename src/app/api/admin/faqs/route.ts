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

export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const faqs = await db.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok({ faqs });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(faqSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const f = await db.faq.create({
      data: {
        question: sanitizeText(data.question),
        answer: sanitizeText(data.answer),
        category: sanitizeText(data.category),
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      },
    });
    await withAudit(user, "CREATE_FAQ", "Faq", f.id, { question: f.question });
    return ok({ faq: f });
  } catch (e) {
    console.error("[api/admin/faqs] POST error:", e);
    return fail("Couldn't create the FAQ. Please try again.", 500);
  }
}
