FROM node:20-alpine AS base

# Install pnpm and OpenSSL (required for Prisma)
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl

# Dependencies
FROM base AS deps
WORKDIR /app

COPY apps/api/package.json ./package.json
RUN pnpm install --no-frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY apps/api/src ./src
COPY apps/api/tsup.config.ts ./tsup.config.ts
COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/package.json ./package.json
COPY prisma ./prisma/

# Generate Prisma Client and build
RUN npx prisma generate && npx tsup

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy dependencies and built application
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma/

# Generate Prisma Client in runner
RUN npx prisma generate

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

WORKDIR /app

USER nodejs

EXPOSE 3001

CMD ["node", "dist/index.js"]
