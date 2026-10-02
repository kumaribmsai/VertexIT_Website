# VertexIT Deployment Guide

## Environment (Vercel)

1. Push the repo to GitHub
2. Import into Vercel
3. Set environment variables:
   - `DATABASE_URL` — production Prisma DB URL (or keep SQLite for demo)
   - `NEXT_PUBLIC_SITE_URL` — your production domain
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — `919703686514`
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your production domain
   - `RESEND_API_KEY` — optional (Resend dashboard)
   - `ADMIN_NOTIFICATION_EMAIL` — optional

4. Build command: `bun run build` (or default Next.js build)
5. The Prisma DB needs initialization — run `bun run db:push && bun run db:seed` post-deploy (or use a hosted Postgres for production)

## Production Database

For production, switch from SQLite to PostgreSQL:
1. Update `prisma/schema.prisma`: `provider = "postgresql"`
2. Set `DATABASE_URL` to your Postgres connection string
3. Run `bun run db:push && bun run db:seed`

## Email (Resend)

1. Create a Resend account
2. Verify your sending domain (e.g. `vertexit.in`)
3. Set `RESEND_API_KEY` and `ADMIN_NOTIFICATION_EMAIL`
4. The `from` address is `VertexIT <noreply@vertexit.in>` — update in `src/lib/email.ts` if using a different domain

## Media Storage

Phase 1 uses local file storage in `/public/uploads/`. For production with multiple serverless instances, migrate to:
- Vercel Blob, or
- AWS S3 / Cloudflare R2

Update `src/app/api/admin/media/upload/route.ts` to use your chosen provider.

## Post-Deploy Checklist

- [ ] Create production admin user (change default password!)
- [ ] Configure Resend (or leave email disabled)
- [ ] Add real trainer profiles (publish from admin)
- [ ] Add real testimonials & placement stories
- [ ] Publish blog posts after review
- [ ] Add real job openings
- [ ] Configure Google Maps embed URL in Site Settings
- [ ] Add social media URLs in Site Settings
- [ ] Verify sitemap.xml and robots.txt are accessible
- [ ] Test lead form submission end-to-end
- [ ] Test admin login + lead management
