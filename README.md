# TRUELOVE Platform V1 — Phase 2 (Prisma + Motion)

TRUELOVE is a dynamic romantic digital-gift generator. This build upgrades the V1 foundation with a real Prisma database layer and a reusable animation system.

## Included now

- Next.js App Router
- Dynamic `/(slug)` website renderer
- Admin dashboard + generator
- Template Registry
- Package permissions
- **Prisma ORM 7**
- **Supabase PostgreSQL** target
- Supabase transaction-pooler runtime architecture
- Prisma migrations + seed
- Website create API
- Mock fallback when the database is not configured
- Cloudinary adapter kept for the next media-upload phase
- Framer Motion animation primitives
- 3D tilt cards and ambient motion
- richer animated Love Letter, Anniversary, and Our Story templates
- reduced-motion accessibility fallback

## Quick start

1. Copy `.env.example` to `.env`.
2. Fill `DATABASE_URL` and `DIRECT_URL` from Supabase.
3. Run `npm install`.
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:migrate -- --name init`.
6. Run `npm run prisma:seed`.
7. Run `npm run dev`.

Full instructions: `docs/PHASE_2_SETUP.md`.

## Important architecture decision

**Prisma is the database access layer.** Supabase is the managed PostgreSQL host. We are not using Supabase JS queries for TRUELOVE website records in Phase 2.

## Current database models

- Template
- Package
- Website
- WebsiteMedia
- Order

## Current animated templates

- `love-letter-01` — Dear You
- `anniversary-01` — Forever With You
- `our-story-01` — Our Chapters

The remaining occasions stay registered as planned templates until their final UI is built.

## Next phase

Cloudinary upload + media manager + edit website flow + template-specific dynamic fields.
