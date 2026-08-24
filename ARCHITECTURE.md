# TRUELOVE Architecture — Phase 2

```text
Customer / Admin
      │
      ▼
   Next.js
      │
      ├──────── Public Renderer /[slug]
      │              │
      │              ▼
      │        Template Registry
      │              │
      │      ┌───────┼────────┐
      │      ▼       ▼        ▼
      │   Letter  Anniversary Story ...
      │
      ├──────── Admin Generator
      │              │
      │              ▼
      │        /api/websites
      │
      ▼
    Prisma
      │
      ▼
Supabase PostgreSQL

Media phase:
Admin → Cloudinary → WebsiteMedia → Prisma/Supabase
```

## Database ownership

Prisma owns schema/migrations. Supabase is PostgreSQL hosting, not a second ORM/data-access path.

## Connection model

```text
Next.js / Vercel runtime
        │
        ▼
DATABASE_URL
Supabase transaction pooler :6543
        │
        ▼
PostgreSQL

Prisma CLI / migrations
        │
        ▼
DIRECT_URL
Direct or session :5432
        │
        ▼
PostgreSQL
```

## Motion architecture

Reusable motion primitives live in `components/motion/`:

- `Reveal` — viewport entrance animation
- `TiltCard` — pointer-based 3D card tilt
- `FloatingHearts` — ambient romantic particles
- `GlowOrbs` — slow premium background movement
- `Pressable` — tactile button interaction

Templates consume these primitives instead of reimplementing animation logic.

`prefers-reduced-motion` is respected in global CSS.

## Dynamic website pipeline

```text
/for-someone
     │
     ▼
getWebsiteBySlug()
     │
     ▼
Prisma Website + Template + Package + Media
     │
     ▼
WebsiteRenderer
     │
     ▼
template key → React component
     │
     ▼
customer content injected
```

No customer-specific HTML file is created.
