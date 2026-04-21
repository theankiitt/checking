-- Migration: Add STAFF and MANAGER roles with permissions field
-- Run this migration to enable user management features

BEGIN;

-- Step 1: Add STAFF and MANAGER to the role enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'STAFF';
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MANAGER';

-- Step 2: Add permissions field to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "permissions" TEXT[] DEFAULT '{}';

-- Step 3: Create index for permissions array
CREATE INDEX IF NOT EXISTS "idx_users_permissions" ON "users" USING GIN("permissions");

-- Step 4: Update existing admin users to have full permissions
UPDATE "users"
SET "permissions" = ARRAY['*']
WHERE "role" = 'ADMIN' AND ("permissions" IS NULL OR cardinality("permissions") = 0);

COMMIT;

-- Notes:
-- - Existing admins get full permissions (*)
-- - New STAFF/MANAGER users start with empty permissions
-- - Assign permissions through admin UI
