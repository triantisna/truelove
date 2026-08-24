import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL atau DIRECT_URL belum diisi.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString, max: 1 });
const prisma = new PrismaClient({ adapter });

try {
  await prisma.$queryRaw`SELECT 1`;
  const [templates, packages, websites] = await Promise.all([
    prisma.template.count(),
    prisma.package.count(),
    prisma.website.count()
  ]);
  console.log("✅ PostgreSQL connected");
  console.log({ templates, packages, websites });
} finally {
  await prisma.$disconnect();
}
