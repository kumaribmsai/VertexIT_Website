import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/admin/notifications/[id] — mark a single notification as read.
export async function PATCH(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  try {
    const existing = await db.adminNotification.findUnique({ where: { id } });
    if (!existing) return fail("Notification not found", 404);
    if (existing.isRead) return ok({ notification: existing });
    const notification = await db.adminNotification.update({
      where: { id },
      data: { isRead: true },
    });
    return ok({ notification });
  } catch (e) {
    console.error("[api/admin/notifications/[id]] PATCH error:", e);
    return fail("Couldn't update the notification.", 500);
  }
}
