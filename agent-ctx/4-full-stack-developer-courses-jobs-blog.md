# Task 4 — full-stack-developer (courses/jobs/blog)

## Scope
Build the public-facing Courses, Jobs, and Blog pages for the VertexIT production website. Read worklog.md first; foundation, lib utilities, shared components and seed data already existed.

## Files delivered
- `src/app/(public)/courses/page.tsx` — courses list (breadcrumbs, SectionHeading eyebrow "OUR PROGRAMS", CourseCard 2-col grid, empty state, navy-gradient counsellor CTA, helper links)
- `src/app/(public)/courses/[slug]/page.tsx` — rich course detail (generateStaticParams + generateMetadata, intro/whoFor/whatYouLearn/outcomes/numbered modules/practical/case-studies/career roles/placement/eligibility+mode, FAQs accordion, internal links, disclaimer, sticky sidebar, JSON-LD: Course + Breadcrumb + FAQPage)
- `src/app/(public)/jobs/page.tsx` — jobs list (SectionHeading eyebrow "CURRENT OPENINGS", JobCard grid, EXCELLENT empty state with WhatsApp + Call buttons, dual CTA cards)
- `src/components/site/job-apply-form.tsx` (client) — Apply form with candidateName/phone/email/coverMessage/resume upload (PDF/DOC/DOCX, ≤5MB), honeypot, posts multipart/form-data to /api/job-applications, success + error states (WhatsApp fallback)
- `src/app/(public)/jobs/[slug]/page.tsx` — job detail (generateStaticParams + generateMetadata, hero with company/location/experience/posted/salary, sticky quick-summary card with Apply anchor, description/responsibilities/requirements/skills, recommended-course card via job.courseId || courseDomain, sticky sidebar with `<JobApplyForm>`, JSON-LD: JobPosting + BreadcrumbList)
- `src/components/site/blog-category-filter.tsx` (client) — pill-style category filter using URL searchParam `?category=slug`
- `src/app/(public)/blog/page.tsx` — blog list (SectionHeading eyebrow "CAREER INSIGHTS", category filter, BlogCard grid, empty state, dual CTA)
- `src/app/(public)/blog/[slug]/page.tsx` — post detail (generateStaticParams + generateMetadata article type, hero/category/title/excerpt/author/date, featured image, react-markdown body with custom styled components, tags, author footer, course CTA, related posts via `getRelatedBlogPosts()`, JSON-LD: BlogPosting + BreadcrumbList)

## Decisions / Notes
- Server Components by default; "use client" only for JobApplyForm and BlogCategoryFilter.
- All public reads go through `services/public.ts` (published-only). Job detail also enforces `!isExpired`.
- Course detail duration null → "To be confirmed"; no pricing shown anywhere.
- Job company empty → "Confidential"; salary missing → "To be discussed" (never invented).
- "Potential career pathways" wording + disclaimer line ("Career pathways indicate the types of roles this training prepares you for. Outcomes depend on individual effort, hiring conditions and employer requirements.") + amber disclaimer box ("Course content is educational. Regulatory/licensing requirements vary by jurisdiction.").
- Related-course linking on job & blog detail uses the explicit `courseId` (or `courseDomain` slug fallback for jobs). No guesses from category alone.
- `react-markdown` (already in package.json) renders blog post content with custom components for h1-h3/p/ul/ol/li/a/blockquote/strong/em/hr/code/pre — since Tailwind typography plugin is NOT installed.
- WhatsApp pre-fills: course detail uses `Hi VertexIT, I'm interested in the ${course.title} program.`; job apply fallback uses `Hi VertexIT, I'd like to apply for the ${job.title} role…`.

## Verification
- `bun run lint` → exit 0, no warnings.
- Smoke tests via curl:
  - `/courses`, `/jobs`, `/blog` → 200 (empty state correctly shown for jobs/blog)
  - `/courses/us-mortgage-underwriting` → 200, all sections rendered, JSON-LD (Course + BreadcrumbList + FAQPage) injected, "To be confirmed" shown for null duration
  - unpublished demo jobs/posts → 404 via `notFound()` (correct)
- Temporarily published one demo job + one blog post, verified detail rendering end-to-end (JobApplyForm fields present, JobPosting JSON-LD, react-markdown body, recommended-course CTA, related posts), then reverted DB to original seed state.

## Files referenced (not modified)
- `prisma/schema.prisma`, `src/services/public.ts`, `src/lib/seo.ts`, `src/lib/whatsapp.ts`, `src/lib/site.ts`, `src/lib/validations.ts`, `src/app/api/job-applications/route.ts`
- `src/components/site/{buttons,section-heading,breadcrumbs,json-ld,state,course-card,job-card,blog-card,reveal}.tsx`
