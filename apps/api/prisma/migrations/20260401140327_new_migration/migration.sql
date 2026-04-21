/*
  Warnings:

  - The `status` column on the `chat_rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verificationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `senderType` on the `chat_messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "ChatRoomStatus" AS ENUM ('OPEN', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChatMessageSender" AS ENUM ('USER', 'ADMIN', 'SYSTEM');

-- DropIndex
DROP INDEX IF EXISTS "idx_users_permissions";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "howToCare" TEXT;

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "senderType",
ADD COLUMN     "senderType" "ChatMessageSender" NOT NULL;

-- AlterTable
ALTER TABLE "chat_rooms" DROP COLUMN "status",
ADD COLUMN     "status" "ChatRoomStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "media_items" ADD COLUMN     "ctaText" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "admin_replied_at" TIMESTAMP(3),
ADD COLUMN     "admin_reply" TEXT,
ADD COLUMN     "admin_reply_id" TEXT,
ADD COLUMN     "dislike_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "review_reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customization_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "category" TEXT NOT NULL,
    "customizationType" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" TEXT,
    "deadline" TIMESTAMP(3),
    "contactMethod" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customization_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "review_reactions_user_id_idx" ON "review_reactions"("user_id");

-- CreateIndex
CREATE INDEX "review_reactions_review_id_idx" ON "review_reactions"("review_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_reactions_user_id_review_id_key" ON "review_reactions"("user_id", "review_id");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_entityType_idx" ON "activity_logs"("entityType");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "cart_items_userId_idx" ON "cart_items"("userId");

-- CreateIndex
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "categories"("isActive");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "chat_rooms_status_idx" ON "chat_rooms"("status");

-- CreateIndex
CREATE INDEX "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

-- CreateIndex
CREATE INDEX "products_isActive_isFeatured_createdAt_idx" ON "products"("isActive", "isFeatured", "createdAt");

-- CreateIndex
CREATE INDEX "products_categoryId_isActive_idx" ON "products"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "products_subCategoryId_isActive_idx" ON "products"("subCategoryId", "isActive");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_isOnSale_isActive_idx" ON "products"("isOnSale", "isActive");

-- CreateIndex
CREATE INDEX "products_isBestSeller_isActive_idx" ON "products"("isBestSeller", "isActive");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "reviews_productId_isActive_idx" ON "reviews"("productId", "isActive");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "users"("passwordResetToken");

-- CreateIndex
CREATE INDEX "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- CreateIndex
CREATE INDEX "wishlist_items_productId_idx" ON "wishlist_items"("productId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_admin_reply_id_fkey" FOREIGN KEY ("admin_reply_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
