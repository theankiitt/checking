-- Add password reset and verification fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verification_token" TEXT UNIQUE;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verification_token_expiry" TIMESTAMP;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_reset_token" TEXT UNIQUE;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_reset_token_expiry" TIMESTAMP;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS "users_password_reset_token_idx" ON "users"("password_reset_token");
CREATE INDEX IF NOT EXISTS "users_verification_token_idx" ON "users"("verification_token");
