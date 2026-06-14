FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3001

CMD ["npm", "start"]# initial deploy
# initial deploy
