import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail, withAudit } from "@/lib/admin-api";

// GET /api/admin/leads/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;
  const { id } = await params;
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, slug: true } },
      assignedCounsellor: { select: { id: true, name: true } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lead) return fail("Lead not found", 404);
  return ok({ lead });
}

// PUT /api/admin/leads/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("COUNSELLOR");
  if (error) return error;
  const { id } = await params;
  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) return fail("Lead not found", 404);

  const body = await req.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  const statusChanged = body.status && body.status !== existing.status;

  if (body.status !== undefined) updates.status = String(body.status);
  if (body.assignedCounsellorId !== undefined) {
    updates.assignedCounsellorId = body.assignedCounsellorId || null;
  }
  if (body.nextFollowUpAt !== undefined) {
    updates.nextFollowUpAt = body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null;
  }
  if (body.lastContactedAt !== undefined) {
    updates.lastContactedAt = body.lastContactedAt ? new Date(body.lastContactedAt) : new Date();
  } else if (statusChanged) {
    updates.lastContactedAt = new Date();
  }

  const updated = await db.lead.update({ where: { id }, data: updates });

  if (statusChanged) {
    await db.leadStatusHistory.create({
      data: {
        leadId: id,
        fromStatus: existing.status,
        toStatus: body.status,
        changedById: user.id,
        changedByName: user.name,
        note: body.note ? String(body.note) : null,
      },
    });
    await withAudit(user, "UPDATE_LEAD", "Lead", id, { from: existing.status, to: body.status });
  } else {
    await withAudit(user, "UPDATE_LEAD", "Lead", id, updates);
  }

  return ok({ lead: updated });
}

// DELETE /api/admin/leads/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAdminApi("ADMIN");
  if (error) return error;
  const { id } = await params;
  try {
    await db.lead.delete({ where: { id } });
    await withAudit(user, "DELETE_LEAD", "Lead", id);
    return ok();
  } catch {
    return fail("Lead not found", 404);
  }
}
