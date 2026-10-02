import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminApi, parseBody, ok, fail, withAudit } from "@/lib/admin-api";
import { unlink } from "fs/promises";
import path from "path";

const updateSchema = z.object({
  altText: z.string().max(300).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request body");

  const { data, error: validationError } = parseBody(updateSchema, body);
  if (validationError || !data) return validationError ?? fail("Validation failed", 422);

  try {
    const existing = await db.mediaAsset.findUnique({ where: { id } });
    if (!existing) return fail("Asset not found", 404);
    const asset = await db.mediaAsset.update({
      where: { id },
      data: { altText: data.altText?.trim() || null },
    });
    await withAudit(user, "UPDATE_MEDIA", "MediaAsset", id, { filename: asset.filename });
    return ok({ asset });
  } catch (e) {
    console.error("[api/admin/media] PUT error:", e);
    return fail("Couldn't update the asset. Please try again.", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  const { id } = await params;
  try {
    const existing = await db.mediaAsset.findUnique({ where: { id } });
    if (!existing) return fail("Asset not found", 404);
    await db.mediaAsset.delete({ where: { id } });
    // Best-effort file delete
    try {
      const abs = path.join(process.cwd(), "public", existing.filePath.replace(/^\/+/, ""));
      await unlink(abs);
    } catch (e) {
      console.warn("[media] file delete skipped:", e);
    }
    await withAudit(user, "DELETE_MEDIA", "MediaAsset", id, { filename: existing.filename });
    return ok();
  } catch (e) {
    console.error("[api/admin/media] DELETE error:", e);
    return fail("Couldn't delete the asset. Please try again.", 500);
  }
}
