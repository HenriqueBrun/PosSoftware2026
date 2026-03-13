# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────
FROM node:lts-alpine AS deps

WORKDIR /app

# Copy root workspace manifests
COPY package.json ./

# Copy backend package manifests
COPY apps/backend/package.json ./apps/backend/

# Install workspace dependencies
RUN npm ci --workspace=apps/backend --include-workspace-root

# ─────────────────────────────────────────────
# Stage 2: Build the NestJS app
# ─────────────────────────────────────────────
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy source
COPY apps/backend ./apps/backend

# Generate Prisma client before build
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ─────────────────────────────────────────────
# Stage 3: Production runtime
# ─────────────────────────────────────────────
FROM node:lts-alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=production

# Copy build output and runtime node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package.json ./

USER nestjs

EXPOSE ${PORT:-3001}

ENV PORT=${PORT:-3001}

CMD ["node", "dist/main"]
