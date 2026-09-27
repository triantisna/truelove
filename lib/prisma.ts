import { Pool } from 'pg'; // 👇 Tambahan: Import Pool dari pg
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined; // 👇 Tambahan: Simpan pool di memory global
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  // 1. Gunakan pool lama jika ada, atau buat baru (mencegah koneksi tabrakan)
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: process.env.NODE_ENV === 'production' ? 1 : 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    });

  // 2. Simpan pool ke global object di mode Development
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pgPool = pool;
  }

  // 3. Pasang pool ke adapter Prisma
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export function databaseReady() {
  return Boolean(process.env.DATABASE_URL && prisma);
}
