import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { hashPassword } from "@/lib/password";
import { sanitizeText } from "@/lib/validations";

const ROLES = ["CONTENT_EDITOR", "COUNSELLOR", "ADMIN", "SUPER_ADMIN"] as const;

const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
  resetPassword: z.string().min(6, "Password must be at least 6 characters").max(200).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(updateUserSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const target = await db.adminUser.findUnique({ where: { id } });
    if (!target) return fail("User not found", 404);

    // Prevent self-demotion / self-deactivation
    if (target.id === user.id) {
      if (data.role !== undefined && data.role !== target.role) {
        return fail("You can't change your own role.", 403);
      }
      if (data.isActive === false) {
        return fail("You can't deactivate your own account.", 403);
      }
    }

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = sanitizeText(data.name);
    if (data.role !== undefined) update.role = data.role;
    if (data.isActive !== undefined) update.isActive = data.isActive;
    if (data.resetPassword) update.passwordHash = hashPassword(data.resetPassword);

    const updated = await db.adminUser.update({
      where: { id },
      data: update,
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
    });
    await withAudit(user, "UPDATE_USER", "AdminUser", updated.id, {
      email: updated.email,
      role: updated.role,
      changedFields: Object.keys(update),
    });
    return ok({ user: updated });
  } catch (e) {
    console.error("[api/admin/users] PUT error:", e);
    return fail("Couldn't update the user. Please try again.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("SUPER_ADMIN");
  if (error) return error;

  const { id } = await params;
  try {
    const target = await db.adminUser.findUnique({ where: { id } });
    if (!target) return fail("User not found", 404);
    if (target.id === user.id) {
      return fail("You can't delete your own account.", 403);
    }
    await db.adminUser.delete({ where: { id } });
    await withAudit(user, "DELETE_USER", "AdminUser", id, { email: target.email });
    return ok();
  } catch (e) {
    console.error("[api/admin/users] DELETE error:", e);
    return fail("Couldn't delete the user. Please try again.", 500);
  }
}
