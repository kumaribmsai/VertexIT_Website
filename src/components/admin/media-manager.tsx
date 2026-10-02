"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Copy, Trash2, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader, AdminEmpty, AdminBadge } from "@/components/admin/primitives";

type Asset = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string | null;
  createdAt: string;
};

function formatSize(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function MediaManager({ initial }: { initial: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Upload failed");
      toast.success("Uploaded");
      setAssets((prev) => [json.asset, ...prev]);
      startTransition(() => router.refresh());
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void handleUpload(f);
  }

  async function copyUrl(a: Asset) {
    try {
      await navigator.clipboard.writeText(a.url);
      setCopiedId(a.id);
      toast.success("URL copied");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Couldn't copy URL.");
    }
  }

  function startEdit(a: Asset) {
    setEditingId(a.id);
    setAltDraft(a.altText ?? "");
  }

  async function saveAlt(a: Asset) {
    try {
      const res = await fetch(`/api/admin/media/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText: altDraft }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error("Failed");
      toast.success("Alt text saved");
      setAssets((prev) => prev.map((x) => (x.id === a.id ? { ...x, altText: altDraft || null } : x)));
      setEditingId(null);
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't save alt text.");
    }
  }

  async function remove(a: Asset) {
    if (!confirm(`Delete ${a.filename}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/media/${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Asset deleted");
      setAssets((prev) => prev.filter((x) => x.id !== a.id));
      startTransition(() => router.refresh());
    } catch {
      toast.error("Couldn't delete the asset.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload images and copy their URLs to use across courses, blog posts and pages."
      />

      <div className="mb-6">
        <label
          htmlFor="media-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center transition-colors hover:border-teal hover:bg-teal/5"
        >
          <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy">
            {uploading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </span>
          <span className="font-medium text-navy">{uploading ? "Uploading..." : "Click to upload an image"}</span>
          <span className="mt-1 text-xs text-muted-foreground">PNG, JPEG, WebP, GIF or SVG · max 5 MB</span>
          <input
            id="media-upload"
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPick}
            disabled={uploading}
          />
        </label>
      </div>

      {assets.length === 0 ? (
        <AdminEmpty message="No media uploaded yet. Upload your first image above." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <div key={a.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={a.url}
                  alt={a.altText ?? a.filename}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-navy" title={a.filename}>
                    {a.filename}
                  </p>
                  <AdminBadge tone="slate">{formatSize(a.size)}</AdminBadge>
                </div>

                {editingId === a.id ? (
                  <div className="flex gap-1">
                    <Input
                      value={altDraft}
                      onChange={(e) => setAltDraft(e.target.value)}
                      placeholder="Describe the image"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={() => saveAlt(a)} aria-label="Save alt text">
                      <Check className="h-4 w-4 text-teal" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(a)}
                    className="flex items-center gap-1 text-left text-xs text-slate-500 hover:text-navy"
                    title={a.altText ?? "Add alt text"}
                  >
                    <Pencil className="h-3 w-3 shrink-0" />
                    <span className="truncate">{a.altText || "Add alt text"}</span>
                  </button>
                )}

                <div className="mt-1 flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 flex-1 gap-1"
                    onClick={() => copyUrl(a)}
                  >
                    {copiedId === a.id ? <Check className="h-3 w-3 text-teal" /> : <Copy className="h-3 w-3" />}
                    Copy URL
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-600 hover:text-red-700"
                    onClick={() => remove(a)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
