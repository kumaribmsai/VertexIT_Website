import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { NotificationsManager } from "@/components/admin/notifications-manager";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  await requireAdmin("CONTENT_EDITOR");
  const notifications = await db.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const serialized = notifications.map((n) => ({ ...n, createdAt: n.createdAt.toISOString() }));
  return <NotificationsManager initial={serialized} />;
}
