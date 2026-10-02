import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { FaqsManager } from "@/components/admin/faqs-manager";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  await requireAdmin("CONTENT_EDITOR");
  const faqs = await db.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <FaqsManager initial={faqs} />;
}
