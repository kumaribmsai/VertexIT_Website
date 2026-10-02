import { db } from "@/lib/db";
import { requireAdminApi, ok } from "@/lib/admin-api";

export async function GET() {
  const { error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const notifications = await db.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return ok({ notifications });
}
