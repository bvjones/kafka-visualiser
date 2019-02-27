FROM node:8-alpine

ENV NPM_CONFIG_LOGLEVEL warn

ADD . /src

WORKDIR /src/app

RUN npm install
RUN npm run build

WORKDIR /src/server
RUN npm install

EXPOSE 3000

USER nobody

WORKDIR /src/
CMD ["node", "server/src"]
