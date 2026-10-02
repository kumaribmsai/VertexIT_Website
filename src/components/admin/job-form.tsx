"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2, Save, Trash2, Eye, EyeOff, Calendar, AlertCircle, FileText, X, CheckCircle2,
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

type CourseOption = { slug: string; title: string };

type JobFormInitial = {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  jobType: string;
  workMode: string;
  courseDomain: string;
  skills: string;
  responsibilities: string;
  requirements: string;
  description: string;
  postedDate: string;
  closingDate: string;
  isPublished: boolean;
  isExpired: boolean;
  isDemo: boolean;
  metaTitle: string;
  metaDescription: string;
  applicationCount: number;
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
const WORK_MODES = ["Onsite", "Remote", "Hybrid"] as const;

const EMPTY: Omit<JobFormInitial, "id" | "postedDate" | "applicationCount"> = {
  title: "",
  slug: "",
  company: "",
  location: "",
  experience: "",
  salary: "",
  jobType: "Full-time",
  workMode: "Onsite",
  courseDomain: "",
  skills: "",
  responsibilities: "",
  requirements: "",
  description: "",
  closingDate: "",
  isPublished: false,
  isExpired: false,
  isDemo: false,
  metaTitle: "",
  metaDescription: "",
};

function toInputDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function JobForm({
  courses,
  initial,
}: {
  courses: CourseOption[];
  initial?: JobFormInitial;
}) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    title: initial?.title ?? EMPTY.title,
    slug: initial?.slug ?? EMPTY.slug,
    company: initial?.company ?? EMPTY.company,
    location: initial?.location ?? EMPTY.location,
    experience: initial?.experience ?? EMPTY.experience,
    salary: initial?.salary ?? EMPTY.salary,
    jobType: initial?.jobType ?? EMPTY.jobType,
    workMode: initial?.workMode ?? EMPTY.workMode,
    courseDomain: initial?.courseDomain ?? EMPTY.courseDomain,
    skills: initial?.skills ?? EMPTY.skills,
    responsibilities: initial?.responsibilities ?? EMPTY.responsibilities,
    requirements: initial?.requirements ?? EMPTY.requirements,
    description: initial?.description ?? EMPTY.description,
    closingDate: initial?.closingDate ? toInputDate(initial.closingDate) : EMPTY.closingDate,
    isPublished: initial?.isPublished ?? EMPTY.isPublished,
    isExpired: initial?.isExpired ?? EMPTY.isExpired,
    isDemo: initial?.isDemo ?? EMPTY.isDemo,
    metaTitle: initial?.metaTitle ?? EMPTY.metaTitle,
    metaDescription: initial?.metaDescription ?? EMPTY.metaDescription,
  });

  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from title unless user has manually edited the slug.
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

  function buildPayload(publish?: boolean) {
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      experience: form.experience.trim(),
      salary: form.salary.trim() || null,
      jobType: form.jobType,
      workMode: form.workMode,
      courseDomain: form.courseDomain.trim() || null,
      skills: form.skills,
      responsibilities: form.responsibilities,
      requirements: form.requirements,
      description: form.description,
      closingDate: form.closingDate ? new Date(form.closingDate).toISOString() : null,
      isPublished: publish === true ? true : publish === false ? false : form.isPublished,
      isExpired: form.isExpired,
      isDemo: form.isDemo,
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
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
        ? await fetch(`/api/admin/jobs/${initial!.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/jobs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !json.ok) {
        toast.error(json.error || "We couldn't save the job.");
        return false;
      }
      toast.success(isEdit ? "Job updated" : "Job created");
      if (!isEdit && json.id) {
        router.push(`/admin/jobs/${json.id}`);
      } else {
        router.refresh();
      }
      return true;
    } catch {
      toast.error("We couldn't save the job. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!isEdit) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${initial!.id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        toast.error(json.error || "We couldn't delete this job.");
        return;
      }
      toast.success("Job deleted");
      router.push("/admin/jobs");
      router.refresh();
    } catch {
      toast.error("We couldn't delete this job. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* MAIN COLUMN */}
      <div className="space-y-6">
        {/* Job details */}
        <FormSection
          title="Job Details"
          description="Core information shown in the listing."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title" error={errors.title} required className="sm:col-span-2">
              <Input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="e.g. US Mortgage Underwriter"
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
                  placeholder="us-mortgage-underwriter"
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

            <Field label="Company" hint="Leave blank to display as 'Confidential'.">
              <Input
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
                placeholder="e.g. Axis Bank"
                disabled={saving}
              />
            </Field>

            <Field label="Location">
              <Input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="e.g. Bengaluru, India"
                disabled={saving}
              />
            </Field>

            <Field label="Experience">
              <Input
                value={form.experience}
                onChange={(e) => setField("experience", e.target.value)}
                placeholder="e.g. 2–4 years"
                disabled={saving}
              />
            </Field>

            <Field label="Salary" hint="Leave blank to display as 'To be discussed'.">
              <Input
                value={form.salary}
                onChange={(e) => setField("salary", e.target.value)}
                placeholder="e.g. ₹4–6 LPA"
                disabled={saving}
              />
            </Field>

            <Field label="Job type">
              <Select
                value={form.jobType}
                onValueChange={(v) => setField("jobType", v)}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Work mode">
              <Select
                value={form.workMode}
                onValueChange={(v) => setField("workMode", v)}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Course domain"
              hint="Optional. Links this job to a published course for internal linking."
              className="sm:col-span-2"
            >
              <Select
                value={form.courseDomain || "__none__"}
                onValueChange={(v) => setField("courseDomain", v === "__none__" ? "" : v)}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No linked course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No linked course</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FormSection>

        {/* Content */}
        <FormSection title="Job Content" description="Description, responsibilities, requirements and skills.">
          <div className="space-y-4">
            <Field label="Description" hint="Short overview paragraph shown above the details.">
              <Textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
                placeholder="Briefly describe the role and its impact."
                disabled={saving}
              />
            </Field>
            <Field label="Responsibilities" hint="One per line.">
              <Textarea
                value={form.responsibilities}
                onChange={(e) => setField("responsibilities", e.target.value)}
                rows={6}
                placeholder={"Review loan applications\nAssess creditworthiness\nEnsure compliance"}
                disabled={saving}
              />
            </Field>
            <Field label="Requirements" hint="One per line.">
              <Textarea
                value={form.requirements}
                onChange={(e) => setField("requirements", e.target.value)}
                rows={6}
                placeholder={"2+ years of mortgage experience\nKnowledge of DU/LP systems"}
                disabled={saving}
              />
            </Field>
            <Field label="Skills" hint="One per line. Shown as tag chips on the public site.">
              <Textarea
                value={form.skills}
                onChange={(e) => setField("skills", e.target.value)}
                rows={4}
                placeholder={"Underwriting\nFannie Mae guidelines\nExcel"}
                disabled={saving}
              />
            </Field>
          </div>
        </FormSection>

        {/* SEO */}
        <FormSection title="SEO" description="Optional overrides for search engines and social shares.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meta title" hint="Defaults to job title if blank.">
              <Input
                value={form.metaTitle}
                onChange={(e) => setField("metaTitle", e.target.value)}
                placeholder="e.g. US Mortgage Underwriter at VertexIT"
                maxLength={200}
                disabled={saving}
              />
            </Field>
            <Field label="Meta description">
              <Textarea
                value={form.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
                rows={3}
                placeholder="Short summary for search engines."
                maxLength={500}
                disabled={saving}
              />
            </Field>
          </div>
        </FormSection>
      </div>

      {/* SIDEBAR */}
      <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        {/* Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-heading text-sm font-semibold text-navy">Status</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEdit
              ? `Posted ${initial?.postedDate ? new Date(initial.postedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}`
              : "Posted date is set automatically when you create this job."}
          </p>

          <div className="mt-4 space-y-3">
            <ToggleRow
              label="Published"
              hint={form.isPublished ? "Visible on the public site" : "Hidden from visitors"}
              checked={form.isPublished}
              onChange={(v) => setField("isPublished", v)}
              disabled={saving}
            />
            <ToggleRow
              label="Mark as expired"
              hint="Keeps the record but hides it from the public list"
              checked={form.isExpired}
              onChange={(v) => setField("isExpired", v)}
              disabled={saving}
              tone="amber"
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

          <div className="mt-4">
            <Field label="Closing date" hint="Optional. When applications close.">
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="date"
                  value={form.closingDate}
                  onChange={(e) => setField("closingDate", e.target.value)}
                  disabled={saving}
                  className="pl-9"
                />
              </div>
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

        {/* Applications / Actions */}
        {isEdit && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-heading text-sm font-semibold text-navy">Applications</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {initial?.applicationCount === 0
                ? "No applications received yet."
                : `${initial?.applicationCount} application${(initial?.applicationCount ?? 0) === 1 ? "" : "s"} received.`}
            </p>
            <a
              href="/admin/leads"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-teal hover:underline"
            >
              <FileText className="h-3.5 w-3.5" /> View leads & applications
            </a>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={saving || deleting}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete job
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete <span className="font-medium text-navy">{initial?.title}</span>
                      {(initial?.applicationCount ?? 0) > 0 && (
                        <> and its {initial?.applicationCount} application{(initial?.applicationCount ?? 0) === 1 ? "" : "s"}</>                      )}. This action cannot be undone.
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
          </div>
        )}

        {/* Back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-teal"
          >
            <X className="h-3.5 w-3.5" /> Cancel & back to jobs
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
