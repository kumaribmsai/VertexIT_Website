import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Admin · VertexIT",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/admin/login");
  }
  const user = await db.adminUser.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) {
    redirect("/admin/login?error=disabled");
  }

  const unreadNotifications = await db.adminNotification.count({ where: { isRead: false } });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar userRole={user.role} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar
          user={{ name: user.name, email: user.email, role: user.role }}
          unreadNotifications={unreadNotifications}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
        <footer className="border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal" />
              VertexIT Admin · {user.role}
            </span>
            <Link href="/" className="hover:text-navy" target="_blank">
              View public site →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
