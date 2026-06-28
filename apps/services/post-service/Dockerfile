FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "npm run migrate && npm run start"]
