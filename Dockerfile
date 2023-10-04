FROM node:18
WORKDIR /usr/src/app

COPY yarn.lock ./
COPY package.json ./
RUN yarn install --production

COPY . ./
RUN mkdir ./data

CMD ["node", "app.mjs"]

EXPOSE 8080