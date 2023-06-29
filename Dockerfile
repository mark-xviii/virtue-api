FROM node:18-alpine as dev

RUN apk --update add postgresql-client

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn

RUN yarn add glob rimraf

COPY . .

RUN yarn run build

RUN yarn run start:prod