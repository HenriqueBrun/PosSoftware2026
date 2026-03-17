# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────
FROM node:lts-alpine AS deps

WORKDIR /app

# Copy root workspace manifests
COPY package.json ./
COPY package-lock.json ./

# Copy only the frontend package manifests
COPY apps/frontend/package.json ./apps/frontend/

# Install all workspace dependencies
RUN npm install --workspace=apps/frontend --include-workspace-root

# ─────────────────────────────────────────────
# Stage 2: Build the Next.js app
# ─────────────────────────────────────────────
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy root workspace manifest for Next.js standalone tracing
COPY package.json ./

# Copy source files
COPY apps/frontend ./apps/frontend

# Build Next.js with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app/apps/frontend
RUN npm run build

# ─────────────────────────────────────────────
# Stage 3: Production runtime (minimal)
# ─────────────────────────────────────────────
FROM node:lts-alpine AS runner

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only standalone output (already includes server.js + node_modules subset)
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static

USER nextjs

EXPOSE ${PORT:-3000}

ENV PORT=${PORT:-3000}
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/frontend/server.js"]
