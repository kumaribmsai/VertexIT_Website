import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";
import { sanitizeText } from "@/lib/validations";

// POST /api/admin/leads/[id]/notes — add a note to a lead
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;
  const { id } = await params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return fail("Lead not found", 404);

  const body = await req.json().catch(() => ({}));
  const text = sanitizeText(String(body.body || ""));
  if (!text) return fail("Note body is required", 422);
  if (text.length > 2000) return fail("Note is too long", 422);

  const note = await db.leadNote.create({
    data: {
      leadId: id,
      authorId: user.id,
      authorName: user.name,
      body: text,
    },
  });

  return ok({ note });
}
