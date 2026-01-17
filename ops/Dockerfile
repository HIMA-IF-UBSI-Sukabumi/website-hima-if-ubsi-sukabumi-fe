# =========================
# Base
# =========================
FROM node:20-alpine AS base
WORKDIR /app

# =========================
# Dependencies
# =========================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Build
# =========================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# =========================
# Runner (Production)
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]