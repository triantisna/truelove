import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 reads its CLI datasource from prisma.config.ts.
 *
 * - DIRECT_URL: Session pooler/direct connection used by migrate/seed tooling.
 * - DATABASE_URL: Runtime pooled connection used by the Next.js app.
 * - Placeholder: lets `prisma generate` succeed on Vercel before DB envs exist.
 *
 * `DIRECT_URL` is our environment-variable name; Prisma 7 no longer has a
 * separate `datasource.directUrl` config property.
 */
const cliDatabaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/truelove";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  datasource: {
    url: cliDatabaseUrl
  }
});
