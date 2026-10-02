import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";

// GET /api/admin/newsletter/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;
  const { id } = await params;
  const sub = await db.newsletterSubscriber.findUnique({ where: { id } });
  if (!sub) return fail("Not found", 404);
  return ok({ subscriber: sub });
}

// PUT /api/admin/newsletter/[id] — toggle active
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const updated = await db.newsletterSubscriber.update({
    where: { id },
    data: { isActive: Boolean(body.isActive) },
  });
  return ok({ subscriber: updated });
}

// DELETE /api/admin/newsletter/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;
  const { id } = await params;
  await db.newsletterSubscriber.delete({ where: { id } });
  return ok();
}
