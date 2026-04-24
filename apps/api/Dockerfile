FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api/
COPY apps/api/prisma ./prisma/

WORKDIR /app/apps/api
RUN ./node_modules/.bin/prisma generate
RUN npx tsup

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy workspace files for production install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json

# Install production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Copy built artifacts and schema
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma/
COPY apps/api/entrypoint.sh ./entrypoint.sh

# Copy generated Prisma client (with query engine) from builder
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma

RUN mkdir -p /app/uploads /app/apps/api/logs /app/apps/api/uploads && chown -R nodejs:nodejs /app/uploads /app/apps/api/logs /app/apps/api/uploads
RUN chmod +x ./entrypoint.sh

USER nodejs

EXPOSE 4444
ENV PORT=4444
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/apps/api
ENTRYPOINT ["./entrypoint.sh"]
