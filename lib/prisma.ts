import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  const adapter = new PrismaPg({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 3 : 5,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function databaseReady() {
  return Boolean(process.env.DATABASE_URL && prisma);
}
