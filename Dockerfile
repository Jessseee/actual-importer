FROM node:18
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE $SERVER_PORT

CMD ["node", "app.mjs"]