FROM node:8

ENV NPM_CONFIG_LOGLEVEL warn

ADD . /src

RUN /usr/sbin/useradd -u 10001 --create-home --home-dir /usr/local/optimus --shell /bin/bash optimus
RUN chown -R optimus /src

USER optimus
ENV HOME /usr/local/optimus

WORKDIR /src/app
RUN npm install
RUN npm run build

WORKDIR /src/server
RUN npm install

EXPOSE 3000
CMD ["node", "src/index.js"]
