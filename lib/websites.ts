import { prisma } from '@/lib/prisma';

import {
  getWebsiteBySlug as getMockWebsiteBySlug,
  mockWebsites,
} from '@/lib/mock-data';

import type { JsonValue, WebsiteInput } from '@/lib/validation';
import type { Prisma } from '@/generated/prisma/client';

import type { WebsiteRecord, WebsiteStatus } from '@/types/website';

function normalizeStatus(status: string): WebsiteStatus {
  return status.toLowerCase() as WebsiteStatus;
}

function isPublicWebsite(website: WebsiteRecord, now = new Date()): boolean {
  if (website.status !== 'published') {
    return false;
  }

  if (!website.expiresAt) {
    return true;
  }

  const expiresAt = new Date(website.expiresAt);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt > now;
}

function getStringContent(content: Record<string, any>, key: string): string {
  const value = content[key];

  return typeof value === 'string' ? value : '';
}

function toWebsiteRecord(row: any): WebsiteRecord {
  const content = (row.content ?? {}) as Record<string, any>;

  return {
    id: row.id,

    slug: row.slug,

    templateId: row.template?.key ?? row.templateId,

    packageId: row.package?.key ?? row.packageId,

    /*
     * These fields are kept as normalized
     * compatibility fields.
     *
     * Template-specific data should be read
     * from `content`.
     */
    senderName:
      getStringContent(content, 'senderName') ||
      getStringContent(content, 'sender_name'),

    receiverName:
      getStringContent(content, 'receiverName') ||
      getStringContent(content, 'receiver_name'),

    title:
      getStringContent(content, 'heroTitle') ||
      getStringContent(content, 'title'),

    message:
      getStringContent(content, 'mainMessage') ||
      getStringContent(content, 'message'),

    eventDate:
      content.eventDate?.toString?.() ??
      content.event_date?.toString?.() ??
      undefined,

    musicUrl:
      getStringContent(content, 'backgroundMusic') ||
      getStringContent(content, 'music') ||
      undefined,

    theme: getStringContent(content, 'theme') || 'romantic',

    status: normalizeStatus(row.status),

    expiresAt: row.expiresAt?.toISOString?.() ?? row.expiresAt ?? undefined,

    createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,

    content,

    media: (row.media ?? []).map((media: any) => ({
      id: media.id,
      websiteId: media.websiteId,
      type: media.type.toLowerCase(),
      url: media.url,
      caption: media.caption ?? undefined,
      sortOrder: media.sortOrder,
    })),
  };
}

export async function getWebsiteBySlug(
  slug: string,
): Promise<WebsiteRecord | null> {
  if (!prisma) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_NOT_CONFIGURED');
    }

    const website = await getMockWebsiteBySlug(slug);
    return website && isPublicWebsite(website) ? website : null;
  }

  const row = await prisma.website.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gt: new Date(),
          },
        },
      ],
    },

    include: {
      template: true,

      package: true,

      media: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return toWebsiteRecord(row);
}

export async function getWebsiteById(
  id: string,
): Promise<WebsiteRecord | null> {
  if (!prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const row = await prisma.website.findUnique({
    where: {
      id,
    },

    include: {
      template: true,

      package: true,

      media: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return toWebsiteRecord(row);
}

export async function listWebsites(): Promise<WebsiteRecord[]> {
  if (!prisma) {
    return mockWebsites;
  }

  const rows = await prisma.website.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    include: {
      template: true,

      package: true,

      media: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  return rows.map(toWebsiteRecord);
}

export async function websiteStats() {
  if (!prisma) {
    return {
      total: mockWebsites.length,

      published: mockWebsites.filter((site) => site.status === 'published')
        .length,

      draft: mockWebsites.filter((site) => site.status === 'draft').length,

      preview: mockWebsites.filter((site) => site.status === 'preview').length,

      mode: 'mock' as const,
    };
  }

  const [total, published, draft, preview] = await Promise.all([
    prisma.website.count(),

    prisma.website.count({
      where: {
        status: 'PUBLISHED',
      },
    }),

    prisma.website.count({
      where: {
        status: 'DRAFT',
      },
    }),

    prisma.website.count({
      where: {
        status: 'PREVIEW',
      },
    }),
  ]);

  return {
    total,
    published,
    draft,
    preview,

    mode: 'database' as const,
  };
}

function buildWebsiteContent(input: WebsiteInput) {
  return {
    ...(input.content ?? {}),

    /*
     * New template schema fields
     * take priority over legacy fields.
     */
    senderName: input.content?.senderName ?? input.senderName,

    receiverName: input.content?.receiverName ?? input.receiverName,

    heroTitle: input.content?.heroTitle ?? input.title,

    mainMessage: input.content?.mainMessage ?? input.message ?? '',

    ...(input.content?.openingText !== undefined
      ? {
          openingText: input.content.openingText,
        }
      : {}),

    ...(input.content?.closingText !== undefined
      ? {
          closingText: input.content.closingText,
        }
      : {}),

    ...(input.content?.heroImage !== undefined
      ? {
          heroImage: input.content.heroImage,
        }
      : {}),

    ...(input.content?.gallery !== undefined
      ? {
          gallery: input.content.gallery,
        }
      : {}),

    ...(input.content?.closingImage !== undefined
      ? {
          closingImage: input.content.closingImage,
        }
      : {}),

    backgroundMusic: input.content?.backgroundMusic ?? input.musicUrl ?? '',

    ...(input.eventDate
      ? {
          eventDate: input.eventDate,
        }
      : {}),

    theme: input.content?.theme ?? input.theme ?? 'romantic',
  };
}

type MediaContentValue = {
  url: string;
  publicId: string;
  resourceType?: string;
  caption?: string;
};

type ExtractedMedia = MediaContentValue & {
  fieldKey: string;
  sortOrder: number;
};

function isMediaContentValue(value: JsonValue): value is MediaContentValue {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return (
    typeof value.url === 'string' &&
    typeof value.publicId === 'string' &&
    value.url.length > 0 &&
    value.publicId.length > 0
  );
}

function getMediaType(resourceType?: string): 'IMAGE' | 'VIDEO' | 'AUDIO' {
  if (resourceType === 'video') {
    return 'VIDEO';
  }

  if (resourceType === 'audio') {
    return 'AUDIO';
  }

  return 'IMAGE';
}

function extractMedia(content: Record<string, JsonValue>): {
  content: Record<string, JsonValue>;
  media: ExtractedMedia[];
} {
  const contentWithoutMedia = { ...content };
  const media: ExtractedMedia[] = [];

  for (const [fieldKey, value] of Object.entries(content)) {
    const values = Array.isArray(value)
      ? value.filter(isMediaContentValue)
      : isMediaContentValue(value)
        ? [value]
        : [];

    const isMediaField =
      values.length > 0 &&
      (isMediaContentValue(value) ||
        (Array.isArray(value) && values.length === value.length));

    if (!isMediaField) {
      continue;
    }

    delete contentWithoutMedia[fieldKey];

    values.forEach((item, index) => {
      media.push({
        fieldKey,
        url: item.url,
        publicId: item.publicId,
        resourceType: item.resourceType,
        caption: item.caption,
        sortOrder: index,
      });
    });
  }

  return {
    content: contentWithoutMedia,
    media,
  };
}

export async function createWebsite(
  input: WebsiteInput,
): Promise<WebsiteRecord> {
  if (!prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const [template, packageRecord] = await Promise.all([
    prisma.template.findUnique({
      where: {
        key: input.templateId,
      },
    }),

    prisma.package.findUnique({
      where: {
        key: input.packageId,
      },
    }),
  ]);

  if (!template) {
    throw new Error('TEMPLATE_NOT_SEEDED');
  }

  if (!packageRecord) {
    throw new Error('PACKAGE_NOT_SEEDED');
  }

  const statusMap = {
    draft: 'DRAFT',
    preview: 'PREVIEW',
    published: 'PUBLISHED',
  } as const;

  const { content: contentWithoutMedia, media } = extractMedia(
    input.content ?? {},
  );
  const content = buildWebsiteContent({
    ...input,
    content: contentWithoutMedia,
  });

  const row = await prisma.website.create({
    data: {
      slug: input.slug,

      templateId: template.id,

      packageId: packageRecord.id,

      content: content as Prisma.InputJsonValue,

      status: statusMap[input.status],

      publishedAt: input.status === 'published' ? new Date() : null,

      ...(media.length > 0
        ? {
            media: {
              create: media.map((item) => ({
                fieldKey: item.fieldKey,
                type: getMediaType(item.resourceType),
                url: item.url,
                publicId: item.publicId,
                caption: item.caption,
                sortOrder: item.sortOrder,
              })),
            },
          }
        : {}),
    },

    include: {
      template: true,

      package: true,

      media: true,
    },
  });

  return toWebsiteRecord(row);
}

export async function updateWebsite(
  id: string,
  input: WebsiteInput,
): Promise<WebsiteRecord> {
  if (!prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const existing = await prisma.website.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error('WEBSITE_NOT_FOUND');
  }

  const [template, packageRecord] = await Promise.all([
    prisma.template.findUnique({
      where: {
        key: input.templateId,
      },
    }),

    prisma.package.findUnique({
      where: {
        key: input.packageId,
      },
    }),
  ]);

  if (!template) {
    throw new Error('TEMPLATE_NOT_SEEDED');
  }

  if (!packageRecord) {
    throw new Error('PACKAGE_NOT_SEEDED');
  }

  const statusMap = {
    draft: 'DRAFT',
    preview: 'PREVIEW',
    published: 'PUBLISHED',
  } as const;

  const content = buildWebsiteContent(input);

  const shouldPublish = input.status === 'published';

  const row = await prisma.website.update({
    where: {
      id,
    },

    data: {
      slug: input.slug,

      templateId: template.id,

      packageId: packageRecord.id,

      content: content as Prisma.InputJsonValue,

      status: statusMap[input.status],

      publishedAt: shouldPublish ? (existing.publishedAt ?? new Date()) : null,
    },

    include: {
      template: true,

      package: true,

      media: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  return toWebsiteRecord(row);
}
