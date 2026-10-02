# VertexIT — Mortgage Training & Placement Platform

**LEARN • APPLY** — A production-ready website for VertexIT, a career-focused training and placement assistance institute in Bengaluru, India, specialising in US Mortgage Underwriting and Australian Mortgage Operations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM + SQLite |
| Auth | NextAuth.js v4 (Credentials provider for admin) |
| Email | Resend (optional — fails gracefully when unconfigured) |
| Icons | Lucide React |
| Charts | Recharts (admin dashboard) |
| Validation | Zod |
| Forms | React Hook Form |

> **Note on Supabase:** The original spec called for Supabase (PostgreSQL + Auth + Storage). This environment uses Prisma + SQLite + NextAuth + local file storage instead. The data model, security boundaries (server-side admin checks), and architecture are equivalent — Phase 2 (student portal) can be added without rebuilding.

## Getting Started

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push      # create schema
bun run db:seed      # seed courses, FAQs, blog drafts, demo content, admin user

# Start dev server (port 3000)
bun run dev
```

### Admin Access
- URL: http://localhost:3000/admin/login
- Email: `admin@vertexit.in`
- Password: `vertexit123`

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=919703686514
RESEND_API_KEY=                    # optional — email fails gracefully when empty
ADMIN_NOTIFICATION_EMAIL=          # optional
NEXTAUTH_SECRET=                   # required for production
NEXTAUTH_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (public)/              # Public website (header + footer + mobile CTA layout)
│   │   ├── page.tsx           # Homepage (15 sections)
│   │   ├── courses/           # Courses list + [slug] detail
│   │   ├── jobs/              # Jobs list + [slug] detail + apply form
│   │   ├── blog/              # Blog list + [slug] detail
│   │   ├── about/             # About page
│   │   ├── placement-process/ # 8-step placement journey
│   │   ├── success-stories/   # Placement stories + testimonials
│   │   ├── trainers/          # Trainer profiles
│   │   ├── faq/               # FAQ accordion
│   │   ├── contact/           # Contact info + lead form
│   │   ├── apply/             # Lead form (primary conversion)
│   │   ├── privacy-policy/    # Legal
│   │   ├── terms-and-conditions/
│   │   └── disclaimer/
│   ├── admin/
│   │   ├── login/             # Admin login (no layout guard)
│   │   └── (dashboard)/       # Auth-guarded admin panel
│   │       ├── page.tsx       # Dashboard
│   │       ├── leads/         # Lead pipeline management
│   │       ├── courses/       # Course CMS
│   │       ├── jobs/          # Job CMS
│   │       ├── blog/          # Blog CMS
│   │       ├── trainers/     # Trainer CMS
│   │       ├── testimonials/
│   │       ├── placement-stories/
│   │       ├── faqs/
│   │       ├── site-settings/
│   │       ├── media/         # Media library
│   │       ├── users/        # Admin user management (SUPER_ADMIN)
│   │       ├── audit-logs/
│   │       └── notifications/
│   ├── api/
│   │   ├── leads/             # Public lead submission
│   │   ├── job-applications/ # Public job applications
│   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   └── admin/             # Admin API routes (auth-guarded)
│   ├── robots.ts              # Dynamic robots.txt
│   ├── sitemap.ts             # Dynamic sitemap.xml
│   ├── error.tsx              # Global error boundary
│   ├── not-found.tsx          # 404 page
│   └── layout.tsx             # Root layout (fonts, metadata, toast)
├── components/
│   ├── site/                  # Public site components
│   ├── admin/                 # Admin components
│   └── ui/                    # shadcn/ui primitives
├── lib/                       # Utilities (auth, db, email, seo, validations, whatsapp)
├── services/                  # Data-access layer (published-only reads)
└── prisma/
    ├── schema.prisma          # Database schema
    └── seed.ts                # Seed script
```

## Key Features

### Public Website
- **Homepage**: 15 sections — hero, trust strip, why VertexIT, courses, what you'll learn, how training works, placement journey, career pathways, jobs, success stories, trainers, FAQ, final CTA
- **Courses**: Dynamic, CMS-driven (unlimited courses). Rich detail pages with modules, outcomes, FAQs, JSON-LD structured data
- **Jobs**: Filterable list, detail pages with apply form + resume upload (PDF/DOC/DOCX)
- **Blog**: Markdown-based CMS, category filter, related posts, SEO metadata
- **Lead Generation**: Reusable form with Zod validation, honeypot spam protection, UTM tracking, email notifications
- **WhatsApp Integration**: Pre-filled messages per context (home, US course, AU course, jobs, etc.)
- **Mobile-first**: Sticky bottom CTA bar (WhatsApp / Call / Counsellor), responsive header with mobile drawer
- **SEO**: Per-page metadata, Open Graph, Twitter cards, JSON-LD (Organization, Course, BreadcrumbList, FAQPage, BlogPosting), dynamic sitemap & robots

### Admin Panel
- **Dashboard**: Real stats — lead counts, status breakdown, course enquiries, recent activity
- **Leads CRM**: 16-stage pipeline, status history timeline, notes, counsellor assignment, follow-up scheduling, search & filters
- **Course CMS**: Full CRUD with modules, outcomes, FAQs (add/remove/reorder)
- **Job CMS**: Full CRUD with apply-form integration
- **Blog CMS**: Markdown editor, draft/publish workflow, SEO fields, category management
- **Trainers / Testimonials / Placement Stories / FAQs**: Dialog-based CRUD
- **Site Settings**: Editable brand, contact, social, homepage, and SEO defaults
- **Media Library**: Image upload, alt text, copy URL, delete
- **User Management**: SUPER_ADMIN can create/disable admin users, assign roles
- **Audit Logs**: All key admin actions logged
- **Notifications**: Lead/application notifications with unread badge

### Security
- Admin routes server-side guarded via `requireAdmin()` + role hierarchy
- API routes use `requireAdminApi()` with role checks
- Honeypot + server-side validation on all public forms
- Input sanitization (HTML strip) on free-text fields
- Resumes stored privately (not in /public)
- Admin pages `noindex`; service keys never exposed to client

## Phase 2 Readiness

The schema and architecture support adding a student portal without rebuilding:
- `AdminUser` → extensible to student auth
- `Course`/`CourseModule` → extensible to lessons/resources
- Reserved Phase 2 entities: student profiles, enrollments, lesson progress, assignments, assessments, certificates, placement records

## Documentation

See `docs/` for architecture, database, and deployment guides.

## License

© VertexIT. All rights reserved.
