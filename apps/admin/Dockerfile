FROM node:20 AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies
FROM base AS deps
WORKDIR /app

COPY apps/admin/package.json ./package.json
RUN pnpm install --no-frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY apps/admin/src ./src
COPY apps/admin/public ./public
COPY apps/admin/next.config.ts ./next.config.ts
COPY apps/admin/tsconfig.json ./tsconfig.json
COPY apps/admin/postcss.config.mjs ./postcss.config.mjs
COPY apps/admin/package.json ./package.json

# Build the admin app
RUN npx next build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nodejs

EXPOSE 4001

ENV PORT 4001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
