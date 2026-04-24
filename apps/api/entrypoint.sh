#!/bin/sh
set -e

cd /app/apps/api

echo "Running database migrations..."
npx prisma migrate deploy

echo "Creating default admin user if not exists..."
if node dist/scripts/seedAdmin.cjs; then
  echo "Admin user check completed."
else
  echo "Warning: seedAdmin failed, continuing anyway..."
fi

echo "Starting API server..."
exec node dist/index.cjs
