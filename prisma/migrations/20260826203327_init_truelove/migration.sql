-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('ACTIVE', 'PLANNED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('DRAFT', 'PREVIEW', 'PUBLISHED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'WAITING_PAYMENT', 'PAID', 'PROCESSING', 'REVISION', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "preview_image" TEXT,
    "fields" JSONB NOT NULL,
    "status" "TemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "features" JSONB NOT NULL,
    "allow_text" BOOLEAN NOT NULL DEFAULT false,
    "allow_music" BOOLEAN NOT NULL DEFAULT false,
    "allow_custom_theme" BOOLEAN NOT NULL DEFAULT false,
    "allow_custom_layout" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "event_date" TIMESTAMP(3),
    "music_url" TEXT,
    "theme" TEXT DEFAULT 'romantic',
    "content" JSONB NOT NULL DEFAULT '{}',
    "status" "WebsiteStatus" NOT NULL DEFAULT 'DRAFT',
    "expires_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_media" (
    "id" TEXT NOT NULL,
    "website_id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_whatsapp" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "template_id" TEXT,
    "package_id" TEXT,
    "website_id" TEXT,
    "price" INTEGER NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "order_status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "templates_key_key" ON "templates"("key");

-- CreateIndex
CREATE INDEX "templates_category_status_idx" ON "templates"("category", "status");

-- CreateIndex
CREATE UNIQUE INDEX "packages_key_key" ON "packages"("key");

-- CreateIndex
CREATE INDEX "packages_active_sort_order_idx" ON "packages"("active", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "websites_slug_key" ON "websites"("slug");

-- CreateIndex
CREATE INDEX "websites_status_created_at_idx" ON "websites"("status", "created_at");

-- CreateIndex
CREATE INDEX "websites_template_id_idx" ON "websites"("template_id");

-- CreateIndex
CREATE INDEX "website_media_website_id_type_sort_order_idx" ON "website_media"("website_id", "type", "sort_order");

-- CreateIndex
CREATE INDEX "orders_order_status_created_at_idx" ON "orders"("order_status", "created_at");

-- CreateIndex
CREATE INDEX "orders_customer_whatsapp_idx" ON "orders"("customer_whatsapp");

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_media" ADD CONSTRAINT "website_media_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
