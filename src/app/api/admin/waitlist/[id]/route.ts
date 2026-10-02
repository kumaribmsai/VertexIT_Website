import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";

// PUT /api/admin/waitlist/[id] — update status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const updated = await db.courseWaitlist.update({
    where: { id },
    data: { status: String(body.status) },
  });
  return ok({ entry: updated });
}

// DELETE /api/admin/waitlist/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;
  const { id } = await params;
  await db.courseWaitlist.delete({ where: { id } });
  return ok();
}
