FROM node:16 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM node:16 as runtime

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist 

EXPOSE 3002

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
