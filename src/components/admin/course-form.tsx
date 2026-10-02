"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2, Plus, Trash2, ArrowUp, ArrowDown, Save, AlertTriangle, ExternalLink,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AdminCard } from "@/components/admin/primitives";
import { cn } from "@/lib/utils";
import {
  COURSE_TRAINING_MODES, COURSE_STATUSES, slugify, type CourseInput,
} from "@/lib/admin-content-schemas";

// ---- Type helpers ---------------------------------------------------------
type ModuleItem = { title: string; description: string };
type OutcomeItem = { text: string };
type FaqItem = { question: string; answer: string };

export type CourseFormInitial = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  introduction: string;
  whoFor: string;
  whatYouLearn: string;
  practicalLearning: string;
  caseStudies: string;
  careerRoles: string;
  placementAssistance: string;
  trainingMode: string;
  eligibility: string;
  keySkills: string;
  careerPathways: string;
  duration: string | null;
  batchSchedule: string | null;
  courseFee: string | null;
  status: string;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  isPublished: boolean;
  isDemo: boolean;
  displayOrder: number;
  modules: { id?: string; title: string; description: string }[];
  outcomes: { id?: string; text: string }[];
  faqs: { id?: string; question: string; answer: string }[];
};

const EMPTY_FORM: CourseFormInitial = {
  id: "",
  title: "",
  slug: "",
  shortDescription: "",
  introduction: "",
  whoFor: "",
  whatYouLearn: "",
  practicalLearning: "",
  caseStudies: "",
  careerRoles: "",
  placementAssistance: "",
  trainingMode: "HYBRID",
  eligibility: "",
  keySkills: "",
  careerPathways: "",
  duration: null,
  batchSchedule: null,
  courseFee: null,
  status: "ACTIVE",
  featuredImage: null,
  metaTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: null,
  isPublished: false,
  isDemo: false,
  displayOrder: 0,
  modules: [],
  outcomes: [],
  faqs: [],
};

// ---- Component ------------------------------------------------------------
export function CourseForm({ initial }: { initial?: CourseFormInitial }) {
  const router = useRouter();
  const [form, setForm] = useState<CourseFormInitial>(initial ?? EMPTY_FORM);
  const [submitting, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Track whether the user has manually edited the slug — once touched,
  // we stop auto-deriving it from the title.
  const slugTouchedRef = useRef<boolean>(Boolean(initial?.slug));
  const [slugTouched, setSlugTouched] = useState<boolean>(Boolean(initial?.slug));

  useEffect(() => {
    slugTouchedRef.current = slugTouched;
  }, [slugTouched]);

  function update<K extends keyof CourseFormInitial>(key: K, value: CourseFormInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(value: string) {
    setForm((prev) => {
      const next = { ...prev, title: value };
      if (!slugTouchedRef.current) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function onSlugChange(value: string) {
    if (!slugTouched) setSlugTouched(true);
    update("slug", slugify(value));
  }

  // ---- Modules ------------------------------------------------------------
  function addModule() {
    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", description: "" }],
    }));
  }
  function updateModule(index: number, patch: Partial<ModuleItem>) {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  }
  function removeModule(index: number) {
    setForm((prev) => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
  }
  function moveModule(index: number, dir: -1 | 1) {
    setForm((prev) => {
      const next = [...prev.modules];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, modules: next };
    });
  }

  // ---- Outcomes -----------------------------------------------------------
  function addOutcome() {
    setForm((prev) => ({ ...prev, outcomes: [...prev.outcomes, { text: "" }] }));
  }
  function updateOutcome(index: number, text: string) {
    setForm((prev) => ({
      ...prev,
      outcomes: prev.outcomes.map((o, i) => (i === index ? { text } : o)),
    }));
  }
  function removeOutcome(index: number) {
    setForm((prev) => ({ ...prev, outcomes: prev.outcomes.filter((_, i) => i !== index) }));
  }
  function moveOutcome(index: number, dir: -1 | 1) {
    setForm((prev) => {
      const next = [...prev.outcomes];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, outcomes: next };
    });
  }

  // ---- FAQs ---------------------------------------------------------------
  function addFaq() {
    setForm((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
  }
  function updateFaq(index: number, patch: Partial<FaqItem>) {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));
  }
  function removeFaq(index: number) {
    setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  }
  function moveFaq(index: number, dir: -1 | 1) {
    setForm((prev) => {
      const next = [...prev.faqs];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, faqs: next };
    });
  }

  // ---- Submit -------------------------------------------------------------
  function buildPayload(): CourseInput {
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim(),
      introduction: form.introduction,
      whoFor: form.whoFor,
      whatYouLearn: form.whatYouLearn,
      practicalLearning: form.practicalLearning,
      caseStudies: form.caseStudies,
      careerRoles: form.careerRoles,
      placementAssistance: form.placementAssistance,
      trainingMode: form.trainingMode as CourseInput["trainingMode"],
      eligibility: form.eligibility,
      keySkills: form.keySkills,
      careerPathways: form.careerPathways,
      duration: form.duration?.trim() ? form.duration.trim() : null,
      batchSchedule: form.batchSchedule?.trim() ? form.batchSchedule.trim() : null,
      courseFee: form.courseFee?.trim() ? form.courseFee.trim() : null,
      status: form.status as CourseInput["status"],
      featuredImage: form.featuredImage?.trim() ? form.featuredImage.trim() : null,
      metaTitle: form.metaTitle?.trim() ? form.metaTitle.trim() : null,
      metaDescription: form.metaDescription?.trim() ? form.metaDescription.trim() : null,
      canonicalUrl: form.canonicalUrl?.trim() ? form.canonicalUrl.trim() : null,
      ogTitle: form.ogTitle?.trim() ? form.ogTitle.trim() : null,
      ogDescription: form.ogDescription?.trim() ? form.ogDescription.trim() : null,
      ogImage: form.ogImage?.trim() ? form.ogImage.trim() : null,
      isPublished: form.isPublished,
      isDemo: form.isDemo,
      displayOrder: form.displayOrder,
      modules: form.modules
        .map((m) => ({ title: m.title.trim(), description: m.description ?? "" }))
        .filter((m) => m.title.length > 0),
      outcomes: form.outcomes
        .map((o) => ({ text: o.text.trim() }))
        .filter((o) => o.text.length > 0),
      faqs: form.faqs
        .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
        .filter((f) => f.question.length > 0 && f.answer.length > 0),
    };
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Please enter a course title.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Please enter a slug (or add a title — slug is auto-generated).");
      return;
    }
    if (!form.shortDescription.trim()) {
      setError("Please add a short description so it shows up correctly on the courses list.");
      return;
    }

    const payload = buildPayload();
    const isEdit = Boolean(form.id);
    const url = isEdit ? `/api/admin/courses/${form.id}` : "/api/admin/courses";
    const method = isEdit ? "PUT" : "POST";

    startTransition(async () => {
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) {
          setError(json.error || "We couldn't save the course. Please try again.");
          toast.error(json.error || "We couldn't save the course.");
          return;
        }
        toast.success(isEdit ? "Course updated" : "Course created");
        router.push("/admin/courses");
        router.refresh();
      } catch {
        setError("We couldn't reach the server. Please try again.");
        toast.error("We couldn't reach the server. Please try again.");
      }
    });
  }

  // ---- Render -------------------------------------------------------------
  const isEdit = Boolean(form.id);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basics */}
      <AdminCard title="Basics" description="Core identity for this course.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. US Mortgage Underwriting"
              maxLength={200}
              required
            />
          </Field>
          <Field label="Slug" required hint="Lowercase letters, numbers and hyphens only.">
            <Input
              value={form.slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="us-mortgage-underwriting"
              maxLength={150}
              required
            />
          </Field>
          <Field label="Short description" required className="sm:col-span-2" hint={`${form.shortDescription.length}/300 — shown on the courses list & cards.`}>
            <Textarea
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="One-line summary used on cards and search results."
              maxLength={300}
              rows={2}
              required
            />
          </Field>
          <Field label="Featured image URL" hint="Paste a public image URL. Media uploads coming soon.">
            <Input
              value={form.featuredImage ?? ""}
              onChange={(e) => update("featuredImage", e.target.value || null)}
              placeholder="https://… (leave blank to skip)"
              maxLength={500}
            />
          </Field>
          <Field label="Display order" hint="Lower numbers appear first on the public site.">
            <Input
              type="number"
              min={0}
              max={9999}
              value={form.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Training mode">
            <Select
              value={form.trainingMode}
              onValueChange={(v) => update("trainingMode", v)}
            >
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_TRAINING_MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m.charAt(0) + m.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onValueChange={(v) => update("status", v)}
            >
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </AdminCard>

      {/* Content blocks */}
      <AdminCard title="Content" description="Long-form sections shown on the course detail page.">
        <div className="grid gap-4">
          <Field label="Introduction" hint="Sets the stage for what the course covers.">
            <Textarea
              value={form.introduction}
              onChange={(e) => update("introduction", e.target.value)}
              rows={4}
              placeholder="A paragraph introducing the course…"
            />
          </Field>
          <Field label="Who is this for?" hint="The ideal learner profile.">
            <Textarea
              value={form.whoFor}
              onChange={(e) => update("whoFor", e.target.value)}
              rows={3}
              placeholder="Graduates, career switchers, mortgage/lending professionals…"
            />
          </Field>
          <Field label="What you'll learn" hint="High-level curriculum overview.">
            <Textarea
              value={form.whatYouLearn}
              onChange={(e) => update("whatYouLearn", e.target.value)}
              rows={4}
              placeholder="End-to-end overview of the curriculum…"
            />
          </Field>
          <Field label="Practical learning" hint="Hands-on projects / exercises.">
            <Textarea
              value={form.practicalLearning}
              onChange={(e) => update("practicalLearning", e.target.value)}
              rows={3}
              placeholder="Real-world case studies, simulations, role-play exercises…"
            />
          </Field>
          <Field label="Case studies" hint="Specific examples learners will work through.">
            <Textarea
              value={form.caseStudies}
              onChange={(e) => update("caseStudies", e.target.value)}
              rows={3}
              placeholder="Borrower scenarios, loan file reviews, underwriting calls…"
            />
          </Field>
          <Field label="Career roles" hint="Potential roles this training prepares learners for.">
            <Textarea
              value={form.careerRoles}
              onChange={(e) => update("careerRoles", e.target.value)}
              rows={3}
              placeholder="Junior Underwriter, Mortgage Processor, Loan Analyst…"
            />
          </Field>
          <Field label="Placement assistance" hint="What's included in placement support.">
            <Textarea
              value={form.placementAssistance}
              onChange={(e) => update("placementAssistance", e.target.value)}
              rows={3}
              placeholder="Resume preparation, mock interviews, employer introductions…"
            />
          </Field>
          <Field label="Eligibility" hint="Pre-requisites or background needed.">
            <Textarea
              value={form.eligibility}
              onChange={(e) => update("eligibility", e.target.value)}
              rows={2}
              placeholder="Any graduate. No prior mortgage experience required…"
            />
          </Field>
        </div>
      </AdminCard>

      {/* Skills & Pathways */}
      <AdminCard title="Skills & Pathways" description="Newline-separated lists. Each line becomes a chip on the public page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Key skills" hint="One skill per line.">
            <Textarea
              value={form.keySkills}
              onChange={(e) => update("keySkills", e.target.value)}
              rows={6}
              placeholder={"Loan file review\nUnderwriting analysis\nDU/LP findings\nCompliance checks"}
            />
          </Field>
          <Field label="Career pathways" hint="One pathway per line.">
            <Textarea
              value={form.careerPathways}
              onChange={(e) => update("careerPathways", e.target.value)}
              rows={6}
              placeholder={"Junior Underwriter\nSenior Underwriter\nUnderwriting Manager\nQuality Control Analyst"}
            />
          </Field>
        </div>
      </AdminCard>

      {/* Schedule */}
      <AdminCard title="Schedule & Fee" description="Admin-only fields. Duration null shows 'To be confirmed' on the public site.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Duration" hint="Leave blank to show 'To be confirmed' publicly.">
            <Input
              value={form.duration ?? ""}
              onChange={(e) => update("duration", e.target.value || null)}
              placeholder="e.g. 8 weeks (part-time)"
              maxLength={100}
            />
          </Field>
          <Field label="Batch schedule" hint="Days/timing of live sessions.">
            <Input
              value={form.batchSchedule ?? ""}
              onChange={(e) => update("batchSchedule", e.target.value || null)}
              placeholder="e.g. Mon–Fri, 7:00 PM – 9:00 PM IST"
              maxLength={200}
            />
          </Field>
          <Field
            label="Course fee"
            className="sm:col-span-2"
            hint="Internal reference only."
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={form.courseFee ?? ""}
                  onChange={(e) => update("courseFee", e.target.value || null)}
                  placeholder="e.g. ₹25,000 + GST"
                  maxLength={200}
                  className="max-w-md"
                />
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-amber-700"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Never shown publicly on the website
                </Badge>
              </div>
              <p className="text-xs text-amber-700/90">
                Course fee is admin-only. Pricing is shared by counsellors over WhatsApp / call.
                It will not appear anywhere on the public site.
              </p>
            </div>
          </Field>
        </div>
      </AdminCard>

      {/* SEO */}
      <AdminCard title="SEO & Social" description="Override defaults for search engines and social cards. All fields optional.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Meta title" hint={`${(form.metaTitle ?? "").length}/200`}>
            <Input
              value={form.metaTitle ?? ""}
              onChange={(e) => update("metaTitle", e.target.value || null)}
              placeholder="Defaults to course title if blank"
              maxLength={200}
            />
          </Field>
          <Field label="Meta description" hint={`${(form.metaDescription ?? "").length}/500`}>
            <Input
              value={form.metaDescription ?? ""}
              onChange={(e) => update("metaDescription", e.target.value || null)}
              placeholder="Defaults to short description if blank"
              maxLength={500}
            />
          </Field>
          <Field label="Canonical URL">
            <Input
              value={form.canonicalUrl ?? ""}
              onChange={(e) => update("canonicalUrl", e.target.value || null)}
              placeholder="https://…"
              maxLength={500}
            />
          </Field>
          <Field label="OG image URL">
            <Input
              value={form.ogImage ?? ""}
              onChange={(e) => update("ogImage", e.target.value || null)}
              placeholder="Defaults to featured image"
              maxLength={500}
            />
          </Field>
          <Field label="OG title">
            <Input
              value={form.ogTitle ?? ""}
              onChange={(e) => update("ogTitle", e.target.value || null)}
              placeholder="Defaults to meta title"
              maxLength={200}
            />
          </Field>
          <Field label="OG description">
            <Input
              value={form.ogDescription ?? ""}
              onChange={(e) => update("ogDescription", e.target.value || null)}
              placeholder="Defaults to meta description"
              maxLength={500}
            />
          </Field>
        </div>
      </AdminCard>

      {/* Publishing */}
      <AdminCard title="Publishing" description="Control visibility and demo state.">
        <div className="space-y-4">
          <ToggleRow
            label="Published"
            description="When ON, this course appears on the public website."
            checked={form.isPublished}
            onCheckedChange={(v) => update("isPublished", v)}
          />
          <ToggleRow
            label="Demo content"
            description="When ON, marks this course as demo / sample content."
            checked={form.isDemo}
            onCheckedChange={(v) => update("isDemo", v)}
          />
        </div>
      </AdminCard>

      {/* Modules */}
      <AdminCard
        title="Modules"
        description={`${form.modules.length} module(s) · ordered top-to-bottom on the course page.`}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={addModule}>
            <Plus className="h-4 w-4" />
            Add module
          </Button>
        }
      >
        {form.modules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No modules yet. Click <span className="font-medium text-navy">Add module</span> to start the curriculum.
          </p>
        ) : (
          <ul className="space-y-3">
            {form.modules.map((m, i) => (
              <ModuleRow
                key={i}
                index={i}
                total={form.modules.length}
                title={m.title}
                description={m.description}
                onChange={(patch) => updateModule(i, patch)}
                onRemove={() => removeModule(i)}
                onMove={(dir) => moveModule(i, dir)}
              />
            ))}
          </ul>
        )}
      </AdminCard>

      {/* Outcomes */}
      <AdminCard
        title="Outcomes"
        description={`${form.outcomes.length} outcome(s) · shown as checkmark chips on the course page.`}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={addOutcome}>
            <Plus className="h-4 w-4" />
            Add outcome
          </Button>
        }
      >
        {form.outcomes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No outcomes yet. Add the concrete takeaways learners can expect.
          </p>
        ) : (
          <ul className="space-y-2">
            {form.outcomes.map((o, i) => (
              <OutcomeRow
                key={i}
                index={i}
                total={form.outcomes.length}
                text={o.text}
                onChange={(v) => updateOutcome(i, v)}
                onRemove={() => removeOutcome(i)}
                onMove={(dir) => moveOutcome(i, dir)}
              />
            ))}
          </ul>
        )}
      </AdminCard>

      {/* FAQs */}
      <AdminCard
        title="FAQs"
        description={`${form.faqs.length} FAQ(s) · rendered inside the course detail accordion.`}
        actions={
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        }
      >
        {form.faqs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No course-specific FAQs yet. Add common questions learners ask about this course.
          </p>
        ) : (
          <ul className="space-y-3">
            {form.faqs.map((f, i) => (
              <FaqRow
                key={i}
                index={i}
                total={form.faqs.length}
                question={f.question}
                answer={f.answer}
                onChange={(patch) => updateFaq(i, patch)}
                onRemove={() => removeFaq(i)}
                onMove={(dir) => moveFaq(i, dir)}
              />
            ))}
          </ul>
        )}
      </AdminCard>

      {/* Sticky footer actions */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
              {form.modules.length} modules
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
              {form.outcomes.length} outcomes
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
              {form.faqs.length} FAQs
            </Badge>
          </span>
          {isEdit && form.slug && (
            <Link
              href={`/courses/${form.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-teal hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> View on site
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" asChild disabled={submitting}>
            <Link href="/admin/courses">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[var(--navy)] text-white hover:bg-[var(--navy-light)]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? "Saving…" : "Creating…"}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? "Save changes" : "Create course"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ============================================================
// Sub-components
// ============================================================
function Field({
  label, children, hint, required, className,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-navy">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ToggleRow({
  label, description, checked, onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
      <div>
        <p className="text-sm font-medium text-navy">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ReorderControls({
  index, total, onMove, onRemove,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label="Move up"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={index === total - 1}
        onClick={() => onMove(1)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Remove"
        onClick={onRemove}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-100 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ModuleRow({
  index, total, title, description, onChange, onRemove, onMove,
}: {
  index: number;
  total: number;
  title: string;
  description: string;
  onChange: (patch: Partial<ModuleItem>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50/40 p-3">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy/5 text-xs font-bold text-navy">
          {index + 1}
        </span>
        <div className="grid flex-1 gap-2">
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Module title"
            maxLength={200}
            className="bg-white"
          />
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Short description of what this module covers"
            rows={2}
            maxLength={2000}
            className="bg-white"
          />
        </div>
        <ReorderControls index={index} total={total} onMove={onMove} onRemove={onRemove} />
      </div>
    </li>
  );
}

function OutcomeRow({
  index, total, text, onChange, onRemove, onMove,
}: {
  index: number;
  total: number;
  text: string;
  onChange: (v: string) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal/10 text-xs font-bold text-teal">
        {index + 1}
      </span>
      <Input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Confidently review a residential loan file"
        maxLength={500}
      />
      <ReorderControls index={index} total={total} onMove={onMove} onRemove={onRemove} />
    </li>
  );
}

function FaqRow({
  index, total, question, answer, onChange, onRemove, onMove,
}: {
  index: number;
  total: number;
  question: string;
  answer: string;
  onChange: (patch: Partial<FaqItem>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <li className="rounded-lg border border-slate-200 bg-slate-50/40 p-3">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy/5 text-xs font-bold text-navy">
          Q{index + 1}
        </span>
        <div className="grid flex-1 gap-2">
          <Input
            value={question}
            onChange={(e) => onChange({ question: e.target.value })}
            placeholder="Question"
            maxLength={500}
            className="bg-white"
          />
          <Textarea
            value={answer}
            onChange={(e) => onChange({ answer: e.target.value })}
            placeholder="Answer"
            rows={2}
            maxLength={2000}
            className="bg-white"
          />
        </div>
        <ReorderControls index={index} total={total} onMove={onMove} onRemove={onRemove} />
      </div>
    </li>
  );
}
