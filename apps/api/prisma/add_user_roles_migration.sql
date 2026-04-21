-- Migration: Add STAFF and MANAGER roles with permissions support
-- Run this migration to enable user management feature

-- Step 1: Update the role enum to add STAFF and MANAGER
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'STAFF';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MANAGER';

-- Step 2: Add permissions field to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "permissions" TEXT[] DEFAULT '{}';

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");
CREATE INDEX IF NOT EXISTS "idx_users_permissions" ON "users" USING GIN("permissions");

-- Step 4: Update existing admin users to have full permissions
UPDATE "users"
SET "permissions" = ARRAY['*']
WHERE "role" = 'ADMIN' AND "permissions" IS NULL;

-- Note: Run this migration manually in your database
-- The permissions field will be empty for existing STAFF and MANAGER users
-- They can be assigned permissions through the admin UI
