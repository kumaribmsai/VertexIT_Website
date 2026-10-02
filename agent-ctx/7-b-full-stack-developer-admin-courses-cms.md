---
Task ID: 7-b
Agent: full-stack-developer (admin courses CMS)
Task: Build admin courses list, new, edit, form, and API routes

Work Log:
- Read /home/z/my-project/worklog.md to understand foundation. Confirmed admin layout (auth-guarded, sidebar+topbar) at src/app/admin/(dashboard)/layout.tsx, reusable admin primitives (AdminPageHeader/AdminCard/AdminEmpty/AdminBadge) at src/components/admin/primitives.tsx, admin API helpers (getAdminUser, requireAdminApi, parseBody, ok, fail, withAudit) at src/lib/admin-api.ts, and existing admin-content-schemas.ts (job/blog schemas + slugify helper).
- Verified shadcn Table, Select, Switch, AlertDialog, Button, Input, Textarea, Label, Badge all present in src/components/ui. Sonner Toaster is mounted globally in src/app/layout.tsx (used for toast notifications).
- Extended src/lib/admin-content-schemas.ts with the Course zod schema (courseSchema + COURSE_TRAINING_MODES + COURSE_STATUSES + CourseInput type) covering: Basics (title, slug, shortDescription, featuredImage, trainingMode, status, displayOrder), Content (8 long-form text fields), Skills/Pathways (newline-separated), Schedule (duration/batchSchedule/courseFee all nullable), SEO (metaTitle/description/canonicalUrl/ogTitle/ogDescription/ogImage), Publishing (isPublished/isDemo), and relations arrays (modules/outcomes/faqs). Empty-string safe defaults applied.
- Created src/app/api/admin/courses/route.ts: GET (lists all courses — published AND unpublished, ordered by displayOrder asc + createdAt desc, with _count for modules), POST (validates with courseSchema, enforces slug uniqueness, creates course with nested modules/outcomes/faqs using Prisma nested writes with sortOrder=index, logs CREATE_COURSE audit, fires admin notification on publish).
- Created src/app/api/admin/courses/[id]/route.ts: GET (single course + relations for edit form), PUT (validates, enforces slug uniqueness excluding self, uses db.$transaction to deleteMany all modules/outcomes/faqs then update the course with nested creates — replace-all strategy — fires admin notification on publish transition), DELETE (404 if not found, cascading delete handled by Prisma onDelete: Cascade already in schema, logs DELETE_COURSE audit). All three handlers use requireAdminApi("CONTENT_EDITOR") and return {ok:true, id} / {ok:false, error}.
- Created src/components/admin/course-form.tsx (client): single-page comprehensive form organised into AdminCard sections (Basics, Content, Skills & Pathways, Schedule & Fee, SEO & Social, Publishing, Modules, Outcomes, FAQs). Uses plain useState for simplicity. Features: slug auto-derives from title via slugify() until the user manually edits the slug field (slugTouched ref/state). Modules/Outcomes/FAQs support add/remove/reorder (up/down buttons). courseFee field marked with amber AlertTriangle warning badge "Never shown publicly on the website" + helper copy. duration hint notes "Leave blank to show 'To be confirmed' publicly". Sticky footer with summary badges + View-on-site link (edit mode only) + Cancel/Save buttons. Submits to POST /api/admin/courses (new) or PUT /api/admin/courses/[id] (edit); on success: sonner toast + router.push + router.refresh. On error: inline red banner + toast. Friendly messages — never surfaces technical errors.
- Created src/components/admin/course-actions.tsx (client): row-level actions (Edit pencil → /admin/courses/[id], View-on-site external link shown only when published, Delete trash → AlertDialog confirmation). On delete: calls DELETE /api/admin/courses/[id], shows toast, calls router.refresh().
- Created src/app/admin/(dashboard)/courses/page.tsx (server component, force-dynamic): AdminPageHeader with "New Course" navy action button → /admin/courses/new. Three summary cards (Total / Published / Drafts). shadcn Table with columns: Course (title + truncated shortDescription, links to edit), Slug, Mode, Status (AdminBadge coloured), Published (green badge) + Demo (amber badge when applicable), Modules count chip, Created date, Actions (AdminCourseActions). Empty state via AdminEmpty when no courses.
- Created src/app/admin/(dashboard)/courses/new/page.tsx (server): AdminPageHeader "New Course" with backHref="/admin/courses", renders <CourseForm /> with no initial state.
- Created src/app/admin/(dashboard)/courses/[id]/page.tsx (server, force-dynamic): fetches course by id with relations (modules/outcomes/faqs ordered by sortOrder asc), calls notFound() if missing, maps to CourseFormInitial shape and renders <CourseForm initial={initial} />.
- Lint check: ran `bunx eslint` on all newly created files + admin-content-schemas.ts — zero warnings, zero errors. (Two pre-existing errors in blog/page.tsx and jobs/page.tsx — escaped-quote parsing issues left by an earlier agent; not touched.)
- TypeScript check: ran `bunx tsc --noEmit` — zero errors in any of my new files.

Stage Summary:
- Files created:
  - src/app/admin/(dashboard)/courses/page.tsx (list page, server)
  - src/app/admin/(dashboard)/courses/new/page.tsx (new wrapper, server)
  - src/app/admin/(dashboard)/courses/[id]/page.tsx (edit wrapper, server)
  - src/components/admin/course-form.tsx (client, comprehensive form)
  - src/components/admin/course-actions.tsx (client, row actions + delete dialog)
  - src/app/api/admin/courses/route.ts (GET list, POST create)
  - src/app/api/admin/courses/[id]/route.ts (GET single, PUT update with replace-all relations, DELETE cascade)
- Files modified:
  - src/lib/admin-content-schemas.ts (appended courseSchema + COURSE_TRAINING_MODES + COURSE_STATUSES + CourseInput type — appended, did not touch existing job/blog schemas)
- Architecture decisions:
  - Modules/outcomes/faqs handled via replace-all on PUT inside a db.$transaction (deleteMany → update with nested creates). Simpler than diffing and the form already sends full arrays each save.
  - Slug auto-derives from title until the user manually edits the slug field — implemented with a ref + state pair so title-driven updates don't clobber manual edits.
  - courseFee marked with amber AlertTriangle warning badge + helper text "Never shown publicly on the website" — matches spec constraint.
  - duration null is valid — the form preserves null and the public course page already renders "To be confirmed" when null.
  - Server components for list/new/edit pages; "use client" only on CourseForm (interactivity) and CourseActions (delete dialog + router.refresh).
  - All API routes use requireAdminApi("CONTENT_EDITOR"), validate via zod, log via withAudit(), return {ok:true, id} / {ok:false, error}. Friendly error messages — no technical stack traces leaked to UI.
  - Admin pages use light theme: white AdminCards on slate-50 bg, navy headings, navy primary button (bg-[var(--navy)] hover:bg-[var(--navy-light)]) with teal accents. Tables have hover states. Forms are mobile-responsive (single-column on mobile, 2-col on sm+).
  - Sticky footer action bar on the form (white/95 backdrop-blur) keeps Save visible while scrolling long content sections.
