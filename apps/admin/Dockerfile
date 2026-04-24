FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
RUN pnpm install --shamefully-hoist --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_API_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY apps/admin ./apps/admin/
COPY packages/typescript-config ./packages/typescript-config/

WORKDIR /app
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN for i in 1 2 3 4 5; do pnpm --filter admin run build && break || echo "Build attempt $i failed, retrying..." && sleep 10; done

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/admin ./apps/admin
COPY --from=builder /app/node_modules ./node_modules

USER nodejs

EXPOSE 4001
ENV PORT=4001
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/apps/admin
CMD ["npx", "next", "start", "-p", "4001"]
