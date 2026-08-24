import { prisma } from "@/lib/prisma";

type DatabaseDiagnostics = {
  configured: boolean;
  connected: boolean;
  seeded: boolean;
  message: string;
  counts: {
    templates: number;
    packages: number;
    websites: number;
  };
};

export async function databaseDiagnostics(): Promise<DatabaseDiagnostics> {
  if (!process.env.DATABASE_URL || !prisma) {
    return {
      configured: false,
      connected: false,
      seeded: false,
      message: "DATABASE_URL belum diisi. TRUELOVE masih berjalan dalam Mock Mode.",
      counts: { templates: 0, packages: 0, websites: 0 }
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    const [templates, packages, websites] = await Promise.all([
      prisma.template.count(),
      prisma.package.count(),
      prisma.website.count()
    ]);

    return {
      configured: true,
      connected: true,
      seeded: templates > 0 && packages > 0,
      message:
        templates > 0 && packages > 0
          ? "Database terhubung dan seed data tersedia."
          : "Database terhubung, tetapi template/package belum di-seed.",
      counts: { templates, packages, websites }
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      seeded: false,
      message: error instanceof Error ? error.message : "DATABASE_CONNECTION_FAILED",
      counts: { templates: 0, packages: 0, websites: 0 }
    };
  }
}
