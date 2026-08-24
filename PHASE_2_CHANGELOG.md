# Phase 2 Changelog

## Database
- Prisma 7 added back as the only ORM/database access layer.
- Supabase remains the managed PostgreSQL provider.
- `DATABASE_URL` is reserved for pooled runtime traffic.
- `DIRECT_URL` is reserved for Prisma CLI/migrations.
- Added Prisma models: Template, Package, Website, WebsiteMedia, Order.
- Added seed script for templates, packages, and the first demo gift.
- Added website repository with mock fallback.
- Added `/api/websites` GET/POST.

## Animation
- Added reusable `Reveal` component.
- Added pointer-driven `TiltCard` 3D motion.
- Added `FloatingHearts` ambient particles.
- Added animated `GlowOrbs` background system.
- Added tactile `Pressable` interaction.
- Upgraded Love Letter, Anniversary, and Our Story dynamic templates.
- Added `prefers-reduced-motion` fallback.

## Admin
- Generator can save draft or publish through the API when Prisma is connected.
- Live phone preview now has motion.
- Dashboard reports Prisma connection state.

## Deferred to next phase
- Supabase Auth / protected admin panel.
- Cloudinary signed uploader.
- Website edit page.
- Media reorder/delete.
- Dynamic fields per template beyond current starter fields.
