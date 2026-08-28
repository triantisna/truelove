import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Prisma,
  TemplateStatus,
  WebsiteStatus
} from "../generated/prisma/client";

import { templates } from "../config/templates";
import { packages } from "../config/packages";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DIRECT_URL or DATABASE_URL is required to seed TRUELOVE."
  );
}

const adapter = new PrismaPg({
  connectionString
});

const prisma = new PrismaClient({
  adapter
});

async function main() {
  for (const [index, template] of templates.entries()) {
    await prisma.template.upsert({
      where: {
        key: template.id
      },

      update: {
        name: template.name,
        category: template.category,
        description: template.description,
        previewImage: template.previewImage,
        schema: template.schema as unknown as Prisma.InputJsonValue,
        status: template.active
          ? TemplateStatus.ACTIVE
          : TemplateStatus.PLANNED,
        sortOrder: index
      },

      create: {
        key: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        previewImage: template.previewImage,
        schema: template.schema as unknown as Prisma.InputJsonValue,
        status: template.active
          ? TemplateStatus.ACTIVE
          : TemplateStatus.PLANNED,
        sortOrder: index
      }
    });
  }

  for (const [index, item] of packages.entries()) {
    await prisma.package.upsert({
      where: {
        key: item.id
      },

      update: {
        name: item.name,
        price: item.price,
        description: item.description,
        features: item.features,
        allowText: item.allowText,
        allowMusic: item.allowMusic,
        allowCustomTheme: item.allowCustomTheme,
        allowCustomLayout: item.allowCustomLayout,
        sortOrder: index,
        active: true
      },

      create: {
        key: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        features: item.features,
        allowText: item.allowText,
        allowMusic: item.allowMusic,
        allowCustomTheme: item.allowCustomTheme,
        allowCustomLayout: item.allowCustomLayout,
        sortOrder: index,
        active: true
      }
    });
  }

  const template =
    await prisma.template.findUniqueOrThrow({
      where: {
        key: "love-letter-01"
      }
    });

  const packageRecord =
    await prisma.package.findUniqueOrThrow({
      where: {
        key: "paket-murah"
      }
    });

  await prisma.website.upsert({
    where: {
      slug: "for-melvina"
    },

    update: {},

    create: {
      slug: "for-melvina",
      templateId: template.id,
      packageId: packageRecord.id,

      status: WebsiteStatus.PUBLISHED,
      publishedAt: new Date(),

      content: {
        sender_name: "Arzaniel",
        receiver_name: "Melvina",
        title: "A little thing for you",

        message:
          "I wanted to make something that feels more personal than a normal message. Thank you for making ordinary days feel special.",

        reasons: [
          "You make ordinary days feel lighter.",
          "You somehow make chaos feel like home.",
          "You are still my favorite person to tell everything to."
        ]
      }
    }
  });

  console.log("TRUELOVE seed complete.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });