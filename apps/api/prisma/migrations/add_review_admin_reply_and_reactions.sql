-- Migration: Add admin reply and reactions to reviews
-- Created: 2026-03-31

-- Add admin reply fields to reviews table
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "admin_reply" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "admin_replied_at" TIMESTAMP(3);
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "admin_reply_id" TEXT;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "like_count" INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "dislike_count" INTEGER DEFAULT 0 NOT NULL;

-- Create review_reactions table
CREATE TABLE IF NOT EXISTS "review_reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "review_reactions_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for user review reaction
CREATE UNIQUE INDEX IF NOT EXISTS "review_reactions_user_id_review_id_key" ON "review_reactions"("user_id", "review_id");
CREATE INDEX IF NOT EXISTS "review_reactions_user_id_idx" ON "review_reactions"("user_id");
CREATE INDEX IF NOT EXISTS "review_reactions_review_id_idx" ON "review_reactions"("review_id");

-- Add foreign keys
ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_review_id_fkey"
    FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_admin_reply_id_fkey"
    FOREIGN KEY ("admin_reply_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add constraint for reaction type
ALTER TABLE "review_reactions" ADD CONSTRAINT "review_reactions_type_check"
    CHECK ("type" IN ('LIKE', 'DISLIKE'));
