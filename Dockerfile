FROM node:12-alpine

# Suppress npm info logs that are on by default
ENV NPM_CONFIG_LOGLEVEL=warn

# Suppress npm update notification
ENV NO_UPDATE_NOTIFIER=true

# Create the directory that will contain the app, and make subsequent commands run from this directory
WORKDIR /src

COPY . .

RUN cd app && npm i && npm run build && \
  cd ../server && npm i && npm run build

EXPOSE 3000

USER nobody

CMD ["node", "server/src"]
