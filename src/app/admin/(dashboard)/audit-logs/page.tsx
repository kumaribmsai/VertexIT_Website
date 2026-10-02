import { requireAdmin } from "@/lib/admin-auth";
import { AuditLogsManager } from "@/components/admin/audit-logs-manager";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  await requireAdmin("ADMIN");
  return <AuditLogsManager />;
}
