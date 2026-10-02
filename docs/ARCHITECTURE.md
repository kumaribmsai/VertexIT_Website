# VertexIT Architecture

## Overview

VertexIT is a Next.js 16 App Router application with a clear separation between:
1. **Public website** — server-rendered, SEO-optimized, CMS-driven content
2. **Admin panel** — auth-guarded CRUD interface for managing all content
3. **API layer** — public endpoints (lead/job applications) + admin endpoints (CRUD)

## Request Flow

### Public page render
```
Browser → Next.js Server Component → services/public.ts (Prisma read, published-only) → Component tree → HTML
```

### Lead submission
```
Browser → /apply (LeadForm client component) → POST /api/leads → Zod validation → Prisma create → AdminNotification → Resend email (optional) → { ok: true }
```

### Admin mutation
```
Browser → admin client component → /api/admin/* → requireAdminApi() session check → Zod validation → Prisma mutation → withAudit() log → { ok: true }
```

## Route Groups

- `src/app/(public)/` — all public pages share a layout with `SiteHeader` + `SiteFooter` + `MobileCtaBar`
- `src/app/admin/login/` — standalone (no layout guard)
- `src/app/admin/(dashboard)/` — auth-guarded layout with sidebar + topbar

## Data Access Patterns

- **Public reads**: `services/public.ts` enforces `isPublished: true` on all queries
- **Admin reads/writes**: API routes in `src/app/api/admin/*` use `requireAdminApi()` + `withAudit()`
- **Caching**: `getSiteSettings()` uses a 1-minute in-memory cache; `clearSettingsCache()` is called after admin updates

## Authentication

- NextAuth.js v4 with Credentials provider
- JWT-based sessions (12h expiry)
- Roles: `SUPER_ADMIN` > `ADMIN` > `COUNSELLOR` > `CONTENT_EDITOR`
- Password hashing: Node `crypto.scrypt` (no external dep)
- Server-side role checks via `requireAdmin(minRole)` (redirects) and `requireAdminApi(minRole)` (JSON error)

## Brand Design System

Defined in `src/app/globals.css`:
- **Navy** `#0B2545` (primary) — `.bg-navy`, `.text-navy`
- **Teal** `#0E9E8E` (secondary) — `.bg-teal`, `.text-teal`
- Gradients: `.bg-brand-gradient` (navy→teal), `.bg-teal-gradient`
- Pattern: `.bg-dot-grid` (teal dots)
- Typography: Plus Jakarta Sans (headings) + Inter (body)
- Reveal-on-scroll: `<Reveal>` component (IntersectionObserver, prefers-reduced-motion aware)

## Phase 2 Extension Points

The architecture supports adding a student portal:
1. Add `StudentProfile`, `Enrollment`, `LessonProgress` etc. models to Prisma schema
2. Add NextAuth provider for students (or separate auth)
3. Create `src/app/(student)/` route group with student layout
4. Add `/api/student/*` endpoints with student-scoped access checks
5. Reuse existing `Course`/`CourseModule` data for learning content

No rebuild required — the foundation is designed for incremental extension.
