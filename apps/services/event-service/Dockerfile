## ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npx prisma generate
RUN npm run build
# dist/ now contains compiled app + compiled Prisma client (Prisma 7 generates TS sources)

## ── Stage 2: runtime ────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./dist/generated
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3334

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/server.js"]
