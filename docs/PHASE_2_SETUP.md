# TRUELOVE Phase 2 Setup

Phase 2 keeps **Prisma as the application database layer** while Supabase provides managed PostgreSQL.

## 1. Create a Supabase project

Create an empty project and keep the database password.

In Supabase → **Connect**, copy two PostgreSQL connection strings:

- **Transaction pooler / port 6543** → `DATABASE_URL` for Next.js/Vercel runtime traffic.
- **Direct connection / port 5432**, or **Session pooler / port 5432** if direct IPv6 is unavailable → `DIRECT_URL` for Prisma CLI and migrations.

For the transaction pooler, keep `?pgbouncer=true` in the URL when Supabase provides/recommends it.

## 2. Configure local environment

```bash
cp .env.example .env
```

Fill:

```env
DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://...:5432/postgres"
```

Cloudinary variables can remain empty in Phase 2.

## 3. Install and generate Prisma Client

```bash
npm install
npm run prisma:generate
```

## 4. Create the first migration

```bash
npm run prisma:migrate -- --name init
```

Prisma is the schema source of truth. Do not manually recreate the same tables in Supabase SQL Editor.

## 5. Seed TRUELOVE configuration

```bash
npm run prisma:seed
```

This creates/updates:

- template registry rows
- package rows
- one dynamic demo website: `/for-melvina`

## 6. Run locally

```bash
npm run dev
```

Open:

- `/` storefront
- `/admin` dashboard
- `/admin/websites/create` generator
- `/for-melvina` animated dynamic gift

## 7. Vercel environment variables

Add the same `DATABASE_URL` and `DIRECT_URL` in Vercel Project Settings → Environment Variables.

The runtime URL should use Supabase transaction pooling because Vercel functions are serverless/auto-scaling. The migration URL should use direct/session connectivity.

Then deploy. `npm run build` automatically runs `prisma generate` before `next build`.

## Vercel build before database connection

`prisma generate` does not need a live database. The project therefore uses a harmless local placeholder URL only when neither `DIRECT_URL` nor `DATABASE_URL` is configured. Runtime data remains in mock mode until `DATABASE_URL` is set.

For production database setup, add both variables in Vercel Project Settings → Environment Variables:

- `DATABASE_URL`: Supabase transaction pooler (serverless/runtime, usually port 6543)
- `DIRECT_URL`: Supabase session pooler or direct connection (migrations/tooling, usually port 5432)

Never commit real database passwords into GitHub.
