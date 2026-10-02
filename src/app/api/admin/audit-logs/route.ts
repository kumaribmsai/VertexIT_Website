import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok } from "@/lib/admin-api";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const { error } = await requireAdminApi("ADMIN");
  if (error) return error;

  const url = new URL(req.url);
  const action = url.searchParams.get("action")?.trim() || undefined;
  const pageParam = Number(url.searchParams.get("page") ?? "1");
  const page = Math.max(1, Number.isFinite(pageParam) ? pageParam : 1);

  const where = action ? { action: { contains: action } } : undefined;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.auditLog.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return ok({ logs, total, page, totalPages });
}
