import "dotenv/config";
import { defineConfig } from "prisma/config";

// Keep Prisma Client generation build-safe on Vercel before the real database
// is connected. Migrate/seed commands should use a real DIRECT_URL or DATABASE_URL.
const prismaDatasourceUrl =
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
    url: prismaDatasourceUrl
  }
});
