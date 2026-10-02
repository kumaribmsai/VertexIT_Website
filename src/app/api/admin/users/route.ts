import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { hashPassword } from "@/lib/password";
import { sanitizeText } from "@/lib/validations";

const ROLES = ["CONTENT_EDITOR", "COUNSELLOR", "ADMIN", "SUPER_ADMIN"] as const;

const createUserSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  email: z.string().email("Enter a valid email").max(200),
  role: z.enum(ROLES),
  initialPassword: z.string().min(6, "Password must be at least 6 characters").max(200),
});

export async function GET() {
  const { error } = await requireAdminApi("SUPER_ADMIN");
  if (error) return error;

  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  return ok({ users });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("SUPER_ADMIN");
  if (error) return error;

  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(createUserSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const email = data.email.trim().toLowerCase();
    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) return fail("An account with this email already exists.", 409);

    const created = await db.adminUser.create({
      data: {
        name: sanitizeText(data.name),
        email,
        role: data.role,
        passwordHash: hashPassword(data.initialPassword),
        isActive: true,
      },
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
    });
    await withAudit(user, "CREATE_USER", "AdminUser", created.id, { email: created.email, role: created.role });
    return ok({ user: created });
  } catch (e) {
    console.error("[api/admin/users] POST error:", e);
    return fail("Couldn't create the user. Please try again.", 500);
  }
}
