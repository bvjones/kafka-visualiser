FROM node:8-alpine

ENV NPM_CONFIG_LOGLEVEL warn

ADD . /src

WORKDIR /app/src

RUN npm install
RUN npm run build

EXPOSE 3000

USER nobody

CMD ["node", "server/src"]
