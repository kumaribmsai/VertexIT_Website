"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2, Save, Trash2, Eye, EyeOff, AlertCircle, X, CheckCircle2, FileText, Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { slugify } from "@/lib/admin-content-schemas";
import { cn } from "@/lib/utils";

type CategoryOption = { id: string; name: string; slug: string };
type CourseOption = { id: string; title: string; slug: string };

type BlogFormInitial = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  author: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  publishedAt: string;
  isPublished: boolean;
  isDemo: boolean;
  courseId: string;
};

const EMPTY: Omit<BlogFormInitial, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  categoryId: "",
  author: "VertexIT",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  publishedAt: "",
  isPublished: false,
  isDemo: false,
  courseId: "",
};

// Convert an ISO datetime to yyyy-MM-ddTHH:mm (the value format for datetime-local input).
function toInputDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BlogForm({
  categories, courses, initial,
}: {
  categories: CategoryOption[];
  courses: CourseOption[];
  initial?: BlogFormInitial;
}) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? EMPTY.title,
    slug: initial?.slug ?? EMPTY.slug,
    excerpt: initial?.excerpt ?? EMPTY.excerpt,
    content: initial?.content ?? EMPTY.content,
    featuredImage: initial?.featuredImage ?? EMPTY.featuredImage,
    categoryId: initial?.categoryId ?? EMPTY.categoryId,
    author: initial?.author ?? EMPTY.author,
    tags: initial?.tags ?? EMPTY.tags,
    metaTitle: initial?.metaTitle ?? EMPTY.metaTitle,
    metaDescription: initial?.metaDescription ?? EMPTY.metaDescription,
    canonicalUrl: initial?.canonicalUrl ?? EMPTY.canonicalUrl,
    ogTitle: initial?.ogTitle ?? EMPTY.ogTitle,
    ogDescription: initial?.ogDescription ?? EMPTY.ogDescription,
    ogImage: initial?.ogImage ?? EMPTY.ogImage,
    publishedAt: initial?.publishedAt ? toInputDatetimeLocal(initial.publishedAt) : EMPTY.publishedAt,
    isPublished: initial?.isPublished ?? EMPTY.isPublished,
    isDemo: initial?.isDemo ?? EMPTY.isDemo,
    courseId: initial?.courseId ?? EMPTY.courseId,
  });

  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slugTouched) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugTouched]);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (form.title.trim().length < 2) e.title = "Title is required";
    if (form.slug.trim().length < 2) e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Use lowercase letters, numbers and hyphens only";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildPayload(publish?: boolean): Record<string, unknown> {
    const willPublish = publish === true ? true : publish === false ? false : form.isPublished;
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt,
      content: form.content,
      featuredImage: form.featuredImage.trim() || null,
      categoryId: form.categoryId || null,
      author: form.author.trim() || "VertexIT",
      tags: form.tags,
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
      canonicalUrl: form.canonicalUrl.trim() || null,
      ogTitle: form.ogTitle.trim() || null,
      ogDescription: form.ogDescription.trim() || null,
      ogImage: form.ogImage.trim() || null,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      isPublished: willPublish,
      isDemo: form.isDemo,
      courseId: form.courseId || null,
    };
  }

  async function save(publish?: boolean): Promise<boolean> {
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return false;
    }
    setSaving(true);
    try {
      const payload = buildPayload(publish);
      const res = isEdit
        ? await fetch(`/api/admin/blog/${initial!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/blog`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !json.ok) {
        toast.error(json.error || "We couldn't save the post.");
        return false;
      }
      toast.success(isEdit ? "Post updated" : "Post created");
      if (!isEdit && json.id) {
        router.push(`/admin/blog/${json.id}`);
      } else {
        router.refresh();
      }
      return true;
    } catch {
      toast.error("We couldn't save the post. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!isEdit) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${initial!.id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        toast.error(json.error || "We couldn't delete this post.");
        return;
      }
      toast.success("Post deleted");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      toast.error("We couldn't delete this post. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* MAIN COLUMN */}
      <div className="space-y-6">
        {/* Article details */}
        <FormSection title="Article Details" description="Title, slug, summary and metadata.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Post title" error={errors.title} required className="sm:col-span-2">
              <Input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. How to start a career in US IT underwriting"
                disabled={saving}
                aria-invalid={!!errors.title}
              />
            </Field>

            <Field label="Slug" error={errors.slug} required hint="Lowercase letters, numbers, hyphens.">
              <div className="flex gap-2">
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setField("slug", e.target.value);
                  }}
                  placeholder="how-to-start-us-mortgage-career"
                  disabled={saving}
                  aria-invalid={!!errors.slug}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => {
                    setSlugTouched(false);
                    setForm((f) => ({ ...f, slug: slugify(f.title) }));
                  }}
                  disabled={saving}
                  className="shrink-0"
                >
                  Auto
                </Button>
              </div>
            </Field>

            <Field label="Author">
              <Input
                value={form.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="VertexIT"
                disabled={saving}
              />
            </Field>

            <Field label="Category">
              <Select
                value={form.categoryId || "__none__"}
                onValueChange={(v) => setField("categoryId", v === "__none__" ? "" : v)}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Uncategorised" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Uncategorised</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Tags" hint="Comma-separated keywords." className="sm:col-span-2">
              <Input
                value={form.tags}
                onChange={(e) => setField("tags", e.target.value)}
                placeholder="IT, career, underwriting, India"
                disabled={saving}
              />
            </Field>

            <Field label="Excerpt" hint="Short summary shown on the blog list and search results." className="sm:col-span-2">
              <Textarea
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                rows={3}
                placeholder="One or two sentences summarising this article."
                disabled={saving}
              />
            </Field>

            <Field label="Featured image URL" hint="Public URL of the cover image." className="sm:col-span-2">
              <Input
                value={form.featuredImage}
                onChange={(e) => setField("featuredImage", e.target.value)}
                placeholder="/uploads/blog/cover.jpg or https://…"
                disabled={saving}
              />
              {form.featuredImage && (
                <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                  <img
                    src={form.featuredImage}
                    alt="Featured preview"
                    className="aspect-[16/9] w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </Field>
          </div>
        </FormSection>

        {/* Content */}
        <FormSection title="Content" description="Write your article in Markdown.">
          <Field label="Body" hint="Markdown supported. Use # for headings, - for lists, [text](url) for links.">
            <Textarea
              value={form.content}
              onChange={(e) => setField("content", e.target.value)}
              rows={18}
              placeholder={"# Heading\n\nWrite your article here…\n\n- Point one\n- Point two"}
              className="font-mono text-[0.8rem] leading-relaxed"
              disabled={saving}
            />
          </Field>
          <p className="mt-2 text-[0.7rem] text-muted-foreground">
            <FileText className="mr-1 inline h-3 w-3" />
            Tip: paste Markdown directly from your editor. Live preview is available on the public post page.
          </p>
        </FormSection>

        {/* SEO */}
        <FormSection title="SEO & Social" description="Optional overrides. Falls back to title and excerpt when blank.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meta title">
              <Input
                value={form.metaTitle}
                onChange={(e) => setField("metaTitle", e.target.value)}
                placeholder="Defaults to post title"
                maxLength={200}
                disabled={saving}
              />
            </Field>
            <Field label="Meta description">
              <Textarea
                value={form.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
                rows={3}
                placeholder="Defaults to excerpt"
                maxLength={500}
                disabled={saving}
              />
            </Field>
            <Field label="Canonical URL" hint="If this content was originally published elsewhere.">
              <Input
                value={form.canonicalUrl}
                onChange={(e) => setField("canonicalUrl", e.target.value)}
                placeholder="https://"
                disabled={saving}
              />
            </Field>
            <Field label="OG title" hint="Social share title (defaults to meta title).">
              <Input
                value={form.ogTitle}
                onChange={(e) => setField("ogTitle", e.target.value)}
                placeholder="Defaults to meta title"
                maxLength={200}
                disabled={saving}
              />
            </Field>
            <Field label="OG description" hint="Social share description.">
              <Textarea
                value={form.ogDescription}
                onChange={(e) => setField("ogDescription", e.target.value)}
                rows={3}
                placeholder="Defaults to meta description"
                maxLength={500}
                disabled={saving}
              />
            </Field>
            <Field label="OG image URL" hint="Social share image (1200×630 recommended).">
              <Input
                value={form.ogImage}
                onChange={(e) => setField("ogImage", e.target.value)}
                placeholder="/uploads/blog/og-cover.jpg or https://…"
                disabled={saving}
              />
            </Field>
          </div>
        </FormSection>
      </div>

      {/* SIDEBAR */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        {/* Publish box */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-heading text-sm font-semibold text-navy">Publish</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEdit
              ? form.isPublished
                ? "Currently live on the public blog."
                : "Currently a draft."
              : "Save as draft or publish immediately."}
          </p>

          <div className="mt-4 space-y-3">
            <ToggleRow
              label="Published"
              hint={form.isPublished ? "Live on the public site" : "Hidden from visitors"}
              checked={form.isPublished}
              onChange={(v) => setField("isPublished", v)}
              disabled={saving}
            />
            <ToggleRow
              label="Demo content"
              hint="Flagged as demo/seed data"
              checked={form.isDemo}
              onChange={(v) => setField("isDemo", v)}
              disabled={saving}
              tone="slate"
            />
          </div>

          <div className="mt-4 space-y-3">
            <Field label="Published at" hint="Optional. Auto-set to now on first publish.">
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) => setField("publishedAt", e.target.value)}
                  disabled={saving}
                  className="pl-9"
                />
              </div>
            </Field>

            <Field label="Linked course" hint="Optional. For internal-linking on the public post.">
              <Select
                value={form.courseId || "__none__"}
                onValueChange={(v) => setField("courseId", v === "__none__" ? "" : v)}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No linked course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No linked course</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {isEdit && form.isPublished ? (
              <button
                type="button"
                onClick={() => save(false)}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <EyeOff className="h-4 w-4" />}
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => save(true)}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {isEdit ? "Publish" : "Publish now"}
              </button>
            )}
            <button
              type="button"
              onClick={() => save(undefined)}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-navy/15 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEdit ? "Save changes" : "Save as draft"}
            </button>
          </div>
        </div>

        {/* Delete box */}
        {isEdit && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-heading text-sm font-semibold text-navy">Danger zone</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Deleting a post is permanent. Consider unpublishing instead.
            </p>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={saving || deleting}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete post
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <span className="font-medium text-navy">{initial?.title}</span>.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete();
                    }}
                    disabled={deleting}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      "Delete permanently"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-teal"
          >
            <X className="h-3.5 w-3.5" /> Cancel & back to blog
          </Link>
        </div>
      </div>

      {/* Sticky bottom action bar on mobile */}
      <div className="lg:hidden">
        <div className="sticky bottom-0 -mx-4 flex items-center gap-2 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <button
            type="button"
            onClick={() => save(undefined)}
            disabled={saving}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-navy px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Save" : "Save draft"}
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-navy/15 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function FormSection({
  title, description, children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-3">
        <h2 className="font-heading text-sm font-semibold text-navy">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({
  label, hint, error, required, className, children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-navy">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-[0.7rem] text-muted-foreground">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-[0.7rem] text-destructive" role="alert">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}

function ToggleRow({
  label, hint, checked, onChange, disabled, tone = "navy",
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  tone?: "navy" | "amber" | "slate";
}) {
  const toneClass = {
    navy: "data-[state=checked]:bg-navy",
    amber: "data-[state=checked]:bg-amber-500",
    slate: "data-[state=checked]:bg-slate-500",
  }[tone];
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy">{label}</p>
        {hint && <p className="text-[0.7rem] text-muted-foreground">{hint}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn("shrink-0", toneClass)}
        aria-label={label}
      />
    </div>
  );
}
