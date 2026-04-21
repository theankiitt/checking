FROM node:20 AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies
FROM base AS deps
WORKDIR /app

COPY apps/web/package.json ./package.json
RUN pnpm install --no-frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY apps/web/src ./src
COPY apps/web/public ./public
COPY apps/web/next.config.ts ./next.config.ts
COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/postcss.config.mjs ./postcss.config.mjs
COPY apps/web/package.json ./package.json
COPY prisma ./prisma/

# Generate Prisma Client (needed for auth.ts)
RUN ./node_modules/.bin/prisma generate

# Build the web app
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

EXPOSE 4000

ENV PORT 4000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
