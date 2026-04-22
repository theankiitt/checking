#!/bin/sh
set -e

cd /app/apps/api

echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking for default admin user..."
node dist/scripts/seedAdmin.cjs || echo "Warning: seedAdmin failed, continuing..."

echo "Starting API server..."
exec node dist/index.cjs
