import { db } from "@/lib/db";
import { requireAdminApi, ok, fail } from "@/lib/admin-api";

export async function POST() {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  try {
    const result = await db.adminNotification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    void user;
    return ok({ updated: result.count });
  } catch (e) {
    console.error("[api/admin/notifications/read-all] error:", e);
    return fail("Couldn't mark notifications as read.", 500);
  }
}
