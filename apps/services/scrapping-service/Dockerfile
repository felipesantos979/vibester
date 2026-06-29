FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate
RUN npm run build
RUN mkdir -p dist/src/generated && cp -r src/generated/prisma dist/src/generated/prisma
RUN npm prune --omit=dev

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

RUN printf 'import { defineConfig } from "prisma/config";\nexport default defineConfig({\n  schema: "prisma/schema.prisma",\n  migrations: { path: "prisma/migrations" },\n  datasource: { url: process.env.DATABASE_URL },\n});\n' > prisma.config.mjs

EXPOSE 3000

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/src/server.js"]
