FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --ignore-scripts

COPY . .

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3002

CMD ["npm", "start"]
