import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/admin-auth";
import { ZodSchema } from "zod";

export type AdminUser = { id: string; name: string; email: string; role: string };

export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await db.adminUser.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function requireAdminApi(minRole: "CONTENT_EDITOR" | "COUNSELLOR" | "ADMIN" | "SUPER_ADMIN" = "CONTENT_EDITOR") {
  const user = await getAdminUser();
  if (!user) {
    return {
      user: null as AdminUser | null,
      error: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }
  const rank: Record<string, number> = { CONTENT_EDITOR: 1, COUNSELLOR: 2, ADMIN: 3, SUPER_ADMIN: 4 };
  if (rank[user.role] < rank[minRole]) {
    return {
      user,
      error: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user, error: null };
}

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): { data: T | null; error: NextResponse | null } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      data: null,
      error: NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 },
      ),
    };
  }
  return { data: parsed.data, error: null };
}

export function ok(data: unknown = { ok: true }) {
  return NextResponse.json(data);
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function withAudit(
  user: AdminUser,
  action: string,
  entity: string,
  entityId: string | undefined,
  metadata?: unknown,
) {
  await logAudit({ userId: user.id, userName: user.name, action, entity, entityId, metadata });
}
