# TRUELOVE Platform V1 — Core Setup

Fondasi Dynamic Website Generator untuk TRUELOVE.

## Yang sudah ada

- Next.js App Router + TypeScript
- Public storefront `/`
- Dynamic customer URL `/[slug]`
- Admin dashboard `/admin`
- Website list `/admin/websites`
- Generator draft `/admin/websites/create`
- Template Registry `config/templates.ts`
- Package config `config/packages.ts`
- Occasion config `config/categories.ts`
- Central renderer `lib/website-renderer.tsx`
- Supabase client/server adapters
- Cloudinary adapter
- Health endpoint `/api/health`
- Mock fallback supaya app tetap jalan tanpa env/database
- Draft SQL schema `supabase-schema.sql`

## Jalankan lokal

1. Install Node.js 20+.
2. Copy `.env.example` menjadi `.env.local`.
3. Jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## URL untuk dites

- `/` — storefront foundation
- `/admin` — admin foundation
- `/admin/websites/create` — generator draft + live preview
- `/for-melvina` — dynamic route memakai mock data + LoveLetter01
- `/our-demo-story` — dynamic route + OurStory01
- `/api/health` — integration status

## Konsep engine

`/[slug]` → getWebsiteBySlug → `templateId` → WebsiteRenderer → template component → inject customer data.

Jadi tidak ada file HTML terpisah untuk setiap customer.

## Mock mode

Jika Supabase belum diisi di `.env.local`, sistem otomatis memakai `lib/mock-data.ts`. Ini disengaja supaya fase setup bisa dites sebelum database dibuat.

## Phase 2

1. Create Supabase project.
2. Jalankan `supabase-schema.sql`.
3. Isi env Supabase.
4. Seed templates/packages.
5. Ubah Admin list/create menjadi read/write Supabase.
6. Hubungkan Cloudinary signed upload.
7. Tambahkan Admin Auth.
8. Enable Preview → Publish.

## Catatan paket

Harga saat ini mengikuti blueprint TRUELOVE:
- Template Nama + Foto — Rp15.000
- Template Nama + Foto + Teks — Rp25.000
- Template Nama + Foto + Request Music — Rp25.000
- Paket Murah — Rp30.000
- Paket Effort — Rp99.000
