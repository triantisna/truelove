# TRUELOVE Phase 2B — Manual Supabase Setup

Koneksi plugin Supabase **tidak diperlukan**. Setup ini dilakukan lewat Supabase Dashboard dan Vercel Dashboard.

## A. Buat Supabase project
1. Buka Supabase Dashboard.
2. Create new project.
3. Simpan database password dengan aman.

## B. Buat role khusus Prisma
Di **SQL Editor**, jalankan SQL berikut. Ganti `GANTI_PASSWORD_PRISMA` dengan password kuat milikmu sendiri.

```sql
create user "prisma" with password 'GANTI_PASSWORD_PRISMA' bypassrls createdb;
grant "prisma" to "postgres";
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

## C. Ambil dua connection strings
Supabase Dashboard → **Connect**.

### DIRECT_URL — migration/seed
Gunakan **Session pooler**, port `5432`.
Username harus `prisma.PROJECT_REF` jika memakai role `prisma`.

```env
DIRECT_URL="postgresql://prisma.PROJECT_REF:PRISMA_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?sslmode=require"
```

### DATABASE_URL — runtime Vercel
Gunakan **Transaction pooler**, port `6543`.

```env
DATABASE_URL="postgresql://prisma.PROJECT_REF:PRISMA_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?sslmode=require"
```

> Jangan menyalin contoh secara literal. Gunakan host, project ref, region, dan password dari project Supabase sendiri.

## D. Jalankan migration + seed dari komputer
Buat file `.env` di root project (file ini sudah di-ignore Git).

```env
DIRECT_URL="...session pooler 5432..."
DATABASE_URL="...transaction pooler 6543..."
```

Lalu:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:check
```

Hasil `db:check` yang diharapkan:

```text
✅ PostgreSQL connected
{ templates: >0, packages: >0, websites: >=0 }
```

## E. Isi Vercel Environment Variables
Vercel → TRUELOVE project → Settings → Environment Variables.

Tambahkan:
- `DATABASE_URL` = Transaction pooler `6543`
- `DIRECT_URL` = Session pooler `5432` (berguna untuk tooling; runtime tidak bergantung padanya)

Pilih Production + Preview + Development jika ingin konsisten.
Redeploy project.

## F. Verifikasi tanpa terminal
Setelah deploy, buka:

```text
/admin/setup
```

Target:
- DATABASE_URL = SET
- DIRECT_URL = SET
- Database = ONLINE
- Seed = READY

Lalu test `/admin/websites/create` → Publish → buka slug hasil publish.

## Catatan Prisma 7
`DIRECT_URL` di TRUELOVE adalah **nama environment variable kita sendiri** untuk koneksi migration. Prisma ORM 7 tidak lagi memiliki property `datasource.directUrl`; `prisma.config.ts` cukup memilih DIRECT_URL sebagai `datasource.url` untuk Prisma CLI.
