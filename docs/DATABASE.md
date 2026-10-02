# VertexIT Database

## ORM
Prisma + SQLite (`db/custom.db`)

## Schema Overview

### Core content
- **SiteSettings** (singleton) — brand, contact, social, homepage copy, SEO defaults
- **Course** — title, slug, content fields, training mode, eligibility, SEO, publishing flags
  - **CourseModule** — ordered list of modules (title + description)
  - **CourseOutcome** — learning outcomes (text items)
  - **CourseFaq** — course-specific Q&A
- **Trainer** — mentor profiles
- **Job** — job openings with full metadata
  - **JobApplication** — candidate applications (name, phone, email, resume, message)
- **BlogCategory** + **BlogPost** — blog CMS with SEO fields
- **Faq** — global FAQs (category-grouped)
- **Testimonial** — student testimonials
- **PlacementStory** — detailed placement success stories
- **MediaAsset** — uploaded media (images)
- **HomepageSection** — homepage section visibility/ordering

### Lead pipeline
- **Lead** — full enquiry record with UTM tracking, status, counsellor assignment
- **LeadStatusHistory** — every status change logged (from → to, who, when, note)
- **LeadNote** — counsellor notes on a lead

### Admin
- **AdminUser** — email, passwordHash, role, isActive, lastLoginAt
- **AuditLog** — user, action, entity, entityId, metadata (JSON)
- **AdminNotification** — lead/application notifications (type, title, link, isRead)

## Lead Status Pipeline (16 stages)
`NEW → CONTACTED → COUNSELLING SCHEDULED → COUNSELLING COMPLETED → DEMO SCHEDULED → DEMO COMPLETED → INTERESTED → FOLLOW-UP REQUIRED → ENROLLED → TRAINING → PLACEMENT SUPPORT → INTERVIEW SCHEDULED → PLACED`
Plus terminal/disqualified: `NOT INTERESTED`, `NOT ELIGIBLE`, `CLOSED`

## Commands
```bash
bun run db:push     # sync schema to DB (accept-data-loss)
bun run db:seed      # seed courses, FAQs, blog drafts, demo content, admin user
bun run db:generate  # regenerate Prisma Client
bun run db:reset     # reset DB (destructive)
```

## Seed Data
- 2 published courses (US Mortgage Underwriting, Australia Mortgage) with full modules
- 12 published FAQs
- 10 blog categories + 15 blog drafts (unpublished)
- 2 demo trainers, 3 demo testimonials, 3 demo placement stories, 2 demo jobs (all unpublished, `isDemo=true`)
- 13 homepage section ordering rows
- 1 super admin user

## Phase 2 Reserved Entities
The schema is designed to extend to:
- `StudentProfile` (auth_user_id, education, experience)
- `Enrollment` (student ↔ course, batch, status)
- `LessonProgress` (student ↔ lesson, percentage, completed_at)
- `Assignment` / `AssignmentSubmission`
- `Assessment` / `AssessmentQuestion` / `AssessmentAttempt`
- `Certificate` (certificate_number, issued_date, url)
- `PlacementRecord` (company, role, package, joining_date)
- `StudentPackage` (current CTC, effective_date)
- `StudentDocument` (private, signed URLs)

These are documented for Phase 2 implementation; not created in Phase 1.
