import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, type AdminRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getAdminSession() {
  return getServerSession(authOptions);
}

const ROLE_RANK: Record<AdminRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  COUNSELLOR: 2,
  CONTENT_EDITOR: 1,
};

export async function requireAdmin(minRole: AdminRole = "CONTENT_EDITOR") {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }
  const role = (session.user as { role?: string }).role as AdminRole | undefined;
  if (!role || ROLE_RANK[role] < ROLE_RANK[minRole]) {
    redirect("/admin?error=forbidden");
  }
  const dbUser = await db.adminUser.findUnique({
    where: { email: session.user.email! },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!dbUser || !dbUser.isActive) {
    redirect("/admin/login?error=disabled");
  }
  return { session, user: dbUser };
}

export async function logAudit(opts: {
  userId?: string;
  userName?: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: unknown;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId: opts.userId,
        userName: opts.userName,
        action: opts.action,
        entity: opts.entity,
        entityId: opts.entityId,
        metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
      },
    });
  } catch (e) {
    console.warn("[audit] failed to write log:", e);
  }
}
