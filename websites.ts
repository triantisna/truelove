import { prisma } from "@/lib/prisma";
import { getWebsiteBySlug as getMockWebsiteBySlug, mockWebsites } from "@/lib/mock-data";
import type { WebsiteInput } from "@/lib/validation";
import type { Prisma } from "@/generated/prisma/client";
import type { WebsiteRecord, WebsiteStatus } from "@/types/website";

function normalizeStatus(status: string): WebsiteStatus {
  return status.toLowerCase() as WebsiteStatus;
}

function toWebsiteRecord(row: any): WebsiteRecord {
  return {
    id: row.id,
    slug: row.slug,
    templateId: row.template?.key ?? row.templateId,
    packageId: row.package?.key ?? row.packageId,
    senderName: row.senderName,
    receiverName: row.receiverName,
    title: row.title,
    message: row.message ?? "",
    eventDate: row.eventDate?.toISOString?.() ?? row.eventDate ?? undefined,
    musicUrl: row.musicUrl ?? undefined,
    theme: row.theme ?? "romantic",
    status: normalizeStatus(row.status),
    expiresAt: row.expiresAt?.toISOString?.() ?? row.expiresAt ?? undefined,
    createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
    content: (row.content ?? {}) as Record<string, unknown>,
    media: (row.media ?? []).map((media: any) => ({
      id: media.id,
      websiteId: media.websiteId,
      type: media.type.toLowerCase(),
      url: media.url,
      caption: media.caption ?? undefined,
      sortOrder: media.sortOrder
    }))
  };
}

export async function getWebsiteBySlug(slug: string): Promise<WebsiteRecord | null> {
  if (!prisma) return getMockWebsiteBySlug(slug);

  const row = await prisma.website.findUnique({
    where: { slug },
    include: {
      template: true,
      package: true,
      media: { orderBy: { sortOrder: "asc" } }
    }
  });

  if (!row) return null;
  return toWebsiteRecord(row);
}

export async function listWebsites(): Promise<WebsiteRecord[]> {
  if (!prisma) return mockWebsites;

  const rows = await prisma.website.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      template: true,
      package: true,
      media: { orderBy: { sortOrder: "asc" } }
    }
  });

  return rows.map(toWebsiteRecord);
}

export async function websiteStats() {
  if (!prisma) {
    return {
      total: mockWebsites.length,
      published: mockWebsites.filter((site) => site.status === "published").length,
      draft: mockWebsites.filter((site) => site.status === "draft").length,
      preview: mockWebsites.filter((site) => site.status === "preview").length,
      mode: "mock" as const
    };
  }

  const [total, published, draft, preview] = await Promise.all([
    prisma.website.count(),
    prisma.website.count({ where: { status: "PUBLISHED" } }),
    prisma.website.count({ where: { status: "DRAFT" } }),
    prisma.website.count({ where: { status: "PREVIEW" } })
  ]);

  return { total, published, draft, preview, mode: "database" as const };
}

export async function createWebsite(input: WebsiteInput): Promise<WebsiteRecord> {
  if (!prisma) throw new Error("DATABASE_NOT_CONFIGURED");

  const [template, packageRecord] = await Promise.all([
    prisma.template.findUnique({ where: { key: input.templateId } }),
    prisma.package.findUnique({ where: { key: input.packageId } })
  ]);

  if (!template) throw new Error("TEMPLATE_NOT_SEEDED");
  if (!packageRecord) throw new Error("PACKAGE_NOT_SEEDED");

  const statusMap = {
    draft: "DRAFT",
    preview: "PREVIEW",
    published: "PUBLISHED"
  } as const;

  const row = await prisma.website.create({
    data: {
      slug: input.slug,
      templateId: template.id,
      packageId: packageRecord.id,
      senderName: input.senderName,
      receiverName: input.receiverName,
      title: input.title,
      message: input.message,
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
      musicUrl: input.musicUrl || null,
      theme: input.theme,
      content: input.content as Prisma.InputJsonValue,
      status: statusMap[input.status],
      publishedAt: input.status === "published" ? new Date() : null
    },
    include: { template: true, package: true, media: true }
  });

  return toWebsiteRecord(row);
}
