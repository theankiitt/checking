# User Management Migration

## Quick Start

To add user management features (STAFF and MANAGER roles with permissions), run:

```bash
# Apply the migration
psql -U postgres -d gharsamma_ecommerce -f apps/api/prisma/migrations/add_staff_manager_roles/migration.sql

# Or use Prisma
cd apps/api
pnpm db:migrate
```

## What This Migration Does

1. **Adds new roles** - STAFF and MANAGER to the UserRole enum
2. **Adds permissions field** - `permissions TEXT[]` column to users table
3. **Creates indexes** - For faster role and permissions queries
4. **Updates admins** - Sets full permissions (\*) for existing ADMIN users

## After Migration

1. **Restart the API server** - To pick up schema changes
2. **Regenerate Prisma client**:
   ```bash
   cd apps/api
   pnpm db:generate
   ```
3. **Test the user management UI** - Navigate to `/dashboard/users` in admin panel

## Permissions

New STAFF/MANAGER users start with no permissions. Assign them through the admin UI:

- Go to User Management
- Click on a user
- Select permissions from categories or use presets

## Rollback

To rollback:

```sql
ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions";
DROP INDEX IF EXISTS "idx_users_permissions";
-- Note: Cannot remove enum values in PostgreSQL easily
```
