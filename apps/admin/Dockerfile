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

WORKDIR /app/apps/admin
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npx next build --webpack

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy the entire app for next start
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY apps/admin ./apps/admin/

USER nodejs

EXPOSE 4001
ENV PORT=4001
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/apps/admin
CMD ["npx", "next", "start"]
