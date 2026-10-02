# Task ID: 5 — full-stack-developer (static pages)

## Summary
Built 11 page files for the VertexIT public website:
- About, Placement Process, Success Stories, Trainers, FAQ (with JSON-LD), Contact (with LeadForm), Apply (with LeadForm)
- Privacy Policy, Terms & Conditions, Disclaimer (legal pages — draft, with "review with legal counsel" notice)
- Global 404 not-found page (standalone, navy + dot-grid, on-brand)

## Files Created
- src/app/(public)/about/page.tsx
- src/app/(public)/placement-process/page.tsx
- src/app/(public)/success-stories/page.tsx
- src/app/(public)/trainers/page.tsx
- src/app/(public)/faq/page.tsx (FAQPage JSON-LD via faqPageJsonLd + <JsonLd>)
- src/app/(public)/contact/page.tsx (LeadForm source="contact")
- src/app/(public)/apply/page.tsx (LeadForm source="apply")
- src/app/(public)/privacy-policy/page.tsx
- src/app/(public)/terms-and-conditions/page.tsx
- src/app/(public)/disclaimer/page.tsx
- src/app/not-found.tsx (standalone, no header/footer)

## Key Decisions
- Server Components by default — no "use client" needed at page level (LeadForm, Reveal, accordion are already client components)
- All pages use the existing shared components: Breadcrumbs, SectionHeading, Reveal, EmptyState, TestimonialCard, TrainerCard, WhatsAppButton, LinkButton, JsonLd, Logo
- Data access via services/public.ts (already filters isPublished only)
- Empty states for success-stories/trainers/faq render tastefully when launch seed data is unpublished
- Legal pages include a "draft" amber banner and use prose-style typography utility classes (no Tailwind typography plugin required)
- 404 page intentionally renders standalone (no SiteHeader/SiteFooter) per spec; renders inside the root layout only
- Wording carefully follows compliance: "Placement assistance with a very high placement rate" + "Actual hiring depends on employer requirements and candidate suitability. VertexIT does not guarantee every candidate a job." appears on About, Placement Process, and Disclaimer pages
- No fabricated stats, employer names, salary averages, or trainer credentials

## Verification
- `bun run lint` → exit 0 (clean)
- All 11 routes return 200, /non-existent-page-404 returns 404 with custom page
- FAQ JSON-LD FAQPage schema renders in HTML
- Empty states appear on /success-stories (placement stories + testimonials) and /trainers as expected

## Notes for Next Agents
- The (public) route group already wires SiteHeader + SiteFooter + MobileCtaBar via layout.tsx — no need to add them per page
- Hero section pattern (navy + dot-grid + teal blur accents + breadcrumbs + eyebrow + h1) is established and reusable for any new pages
- Legal page pattern: hero + amber draft banner + sticky in-page anchor index + body sections + draft reminder at bottom
