import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await requireAdmin("CONTENT_EDITOR");
  const testimonials = await db.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <TestimonialsManager initial={testimonials} />;
}
