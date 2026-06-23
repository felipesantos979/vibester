FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate

RUN npm run build

RUN mkdir -p dist/src/generated && cp -r src/generated/prisma dist/src/generated/prisma

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]
