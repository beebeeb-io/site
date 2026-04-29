FROM node:22-alpine

RUN apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev vips-dev

WORKDIR /srv/app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
