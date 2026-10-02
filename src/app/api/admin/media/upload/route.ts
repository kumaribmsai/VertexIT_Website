import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi, ok, fail, withAudit } from "@/lib/admin-api";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const { user, error } = await requireAdminApi("CONTENT_EDITOR");
  if (error) return error;

  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) return fail("Invalid upload. Please select an image file.");

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return fail("Please choose an image file to upload.");
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return fail("Only image files (PNG, JPEG, WebP, GIF, SVG) are allowed.");
    }
    if (file.size === 0) {
      return fail("The selected file appears to be empty.");
    }
    if (file.size > MAX_BYTES) {
      return fail("Image must be 5 MB or smaller.");
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
      : "";
    const safeExt = /^[a-z0-9]{1,5}$/.test(ext) ? ext : "bin";
    const id = randomBytes(8).toString("hex");
    const filename = `${id}.${safeExt}`;
    const filePath = path.join(uploadsDir, filename);
    const url = `/uploads/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const asset = await db.mediaAsset.create({
      data: {
        filename: file.name.slice(0, 200),
        filePath: `/uploads/${filename}`,
        url,
        mimeType: file.type,
        size: file.size,
        uploadedById: user.id,
      },
    });
    await withAudit(user, "UPLOAD_MEDIA", "MediaAsset", asset.id, { filename: asset.filename });
    return ok({ ok: true, url, id: asset.id, asset });
  } catch (e) {
    console.error("[api/admin/media/upload] error:", e);
    return fail("Couldn't upload the file. Please try again.", 500);
  }
}
