# Task 7-c — full-stack-developer (admin jobs + blog CMS)

## Scope
Build the Admin Jobs CMS and Blog CMS for the VertexIT admin panel — list pages, new/edit pages, client forms, table action cells, and the underlying REST API routes. Read worklog.md and the existing admin foundation (layout, primitives, admin-api helpers) before starting.

## Files delivered

### Shared lib
- `src/lib/admin-content-schemas.ts` — `jobSchema`, `blogPostSchema`, `slugify()`. Both schemas accept nullable optionals and use an `isoOrUndefined` transform that turns ISO date strings (or yyyy-mm-dd inputs) into Date objects, tolerating null/empty.

### API routes (5)
- `src/app/api/admin/jobs/route.ts` — GET list + POST create. Enforces slug uniqueness (409), resolves `courseDomain` slug → `courseId` FK, sends an AdminNotification when published, `withAudit("CREATE_JOB", ...)`.
- `src/app/api/admin/jobs/[id]/route.ts` — GET / PUT / DELETE. Same slug-uniqueness + courseDomain→courseId resolution, `withAudit("UPDATE_JOB"/"DELETE_JOB")`. Cascade-removes applications.
- `src/app/api/admin/blog/route.ts` — GET list (with category join) + POST create. Validates `categoryId` and `courseId` FKs, `withAudit("CREATE_BLOG")`. publishedAt defaults to now() when isPublished becomes true and no explicit date supplied.
- `src/app/api/admin/blog/[id]/route.ts` — GET / PUT / DELETE with FK revalidation, `withAudit("UPDATE_BLOG"/"DELETE_BLOG")`.
- `src/app/api/admin/blog/categories/route.ts` — GET list of BlogCategory rows for the form select.

All admin API routes call `requireAdminApi("CONTENT_EDITOR")` + use `parseBody` for zod validation + return JSON in `{ ok, id?, error?, issues? }` shape. Technical errors are not leaked.

### Admin pages (6)
- `src/app/admin/(dashboard)/jobs/page.tsx` — list with summary cards (Published / Drafts / Total) and table (title+slug, company w/ Confidential fallback, location, workMode+jobType, experience, status badge + isDemo tag, posted date+time, Edit/Delete actions). Empty state via `<AdminEmpty>`. AdminPageHeader with "New Job" action.
- `src/app/admin/(dashboard)/jobs/new/page.tsx` — fetches published courses, wraps `<JobForm>`.
- `src/app/admin/(dashboard)/jobs/[id]/page.tsx` — fetches job (with `_count.applications`), `notFound()` if missing, serialises dates to ISO/yyyy-mm-dd, passes to `<JobForm initial={...}>`.
- `src/app/admin/(dashboard)/blog/page.tsx` — list with summary cards (Published / Drafts / Total) + table (title+slug, category badge, author, status + isDemo, publishedAt, updatedAt, actions).
- `src/app/admin/(dashboard)/blog/new/page.tsx` — fetches categories + published courses, wraps `<BlogForm>`.
- `src/app/admin/(dashboard)/blog/[id]/page.tsx` — fetches post (with category), serialises datetimes, passes to `<BlogForm initial={...}>`.

### Client components (4)
- `src/components/admin/job-form.tsx` — two-column layout (main + sticky sidebar). Sections: Job Details, Job Content, SEO. Sidebar: Status (3 toggles), closingDate (native date input w/ Calendar icon), Publish / Save as draft / Unpublish buttons, AlertDialog delete. Mobile sticky bottom bar.
- `src/components/admin/job-actions.tsx` — Edit link + Delete AlertDialog used in table rows.
- `src/components/admin/blog-form.tsx` — Sections: Article Details (incl. featuredImage live preview), Content (Markdown textarea), SEO & Social (meta + OG + canonical). Sidebar: Publish (isPublished/isDemo toggles, publishedAt datetime-local, courseId Select), Danger zone (Delete AlertDialog). Mobile sticky bottom bar.
- `src/components/admin/blog-actions.tsx` — Edit link + Delete AlertDialog used in table rows.

## Decisions / Notes
- Server components by default; "use client" only on forms + table action cells.
- Auto-slug: `slugify()` regenerates from `title` until the user manually edits the slug field. A manual "Auto" button restores the auto behaviour.
- `postedDate` is auto-set on create (DB default `now()`) and never overwritten on PUT.
- `salary` null is valid — saved as null, public side shows "To be discussed".
- `company` empty string is valid — saved as `""`, public side shows "Confidential".
- `courseDomain` (a course slug) is the source of truth on the form; the API resolves it to `courseId` for the foreign key. Removing it (`__none__`) clears both `courseDomain` and `courseId` on PUT.
- `publishedAt` for blog posts: `null` while draft; on first publish (or when transitioning from draft → published) it's stamped to `now()` if the user hasn't picked a datetime. Subsequent saves preserve the existing publishedAt.
- Forms use `sonner` toasts for success/error feedback; errors are friendlier copy ("We couldn't save the job. Please try again.") rather than raw API messages.
- `AlertDialog` is used for delete confirmations (both inline table delete and edit-page delete) — Radix-native, accessible, focus-trapped.
- Sticky sidebar (`lg:sticky lg:top-20`) on desktop; sticky bottom action bar on mobile for primary actions.
- All admin pages set `metadata.robots = { index: false, follow: false }` (the layout also forces noindex).
- Tables are responsive: `-m-5 overflow-x-auto` wrapper inside `AdminCard` allows horizontal scroll on small screens.

## Verification
- `bun run lint` → 0 errors in my files. (The single remaining warning is in `media-manager.tsx`, a parallel agent's file.)
- `bunx tsc --noEmit` → 0 TypeScript errors in any of my 16 files. (Other agents' WIP files have unrelated type errors that are out of my scope.)

## Files referenced (not modified)
- `prisma/schema.prisma` (Job, BlogPost, BlogCategory, AuditLog, AdminNotification, Course)
- `src/lib/admin-api.ts`, `src/lib/admin-auth.ts`, `src/lib/db.ts`, `src/lib/utils.ts`
- `src/components/admin/primitives.tsx` (AdminPageHeader/AdminCard/AdminEmpty/AdminBadge)
- `src/components/admin/sidebar.tsx` + `nav-config.ts` (already routes /admin/jobs and /admin/blog correctly)
- `src/components/ui/{table,input,textarea,label,switch,select,button,alert-dialog,popover,calendar,sonner}.tsx`
- `src/app/admin/(dashboard)/layout.tsx`
EOF
