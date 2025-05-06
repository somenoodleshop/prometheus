FROM alpine:3.21.3

WORKDIR /app

COPY . /app

RUN apk update && apk upgrade && apk add --no-cache nodejs yarn
RUN yarn && apk del yarn

EXPOSE 80

ENV NODE_ENV production

CMD node src/server.js
