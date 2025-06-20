FROM node:20-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build
RUN yarn global add serve

EXPOSE 5173

CMD ["serve", "-s", "dist"]