FROM node:8

ENV NPM_CONFIG_LOGLEVEL warn

ADD . /src

RUN /usr/sbin/useradd -u 10001 --create-home --home-dir /usr/local/optimus --shell /bin/bash optimus
RUN chown -R optimus /app
RUN chown -R optimus /server

USER optimus
ENV HOME /usr/local/optimus

WORKDIR /server
RUN npm install

WORKDIR /app
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["node", "server/src"]
