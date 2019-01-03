# Kafka Visualiser

Enables the visualisation of message traffic moving through a Kafka message queue.

The project consists of a backend Node.js server and a front-end React app.

## Running Locally

The project is split into two halves with seperate depedencies inside the `app` and `server` directories. To start the visualiser:

1) Create a `.env` file inside the `server` directory. See the `.env.example` for example environment variables.
2) Run `npm install` inside both the `app` and `server` directories.
3) Run `docker-compose up` in the project root to bring up Zookeeper and Kafka inside a docker container.
4) Run `npm run start-producer` inside the `server` directory. This will start producing dummy events.
5) Run `npm start` inside the `server` directory to bring up the server (alternatively, `npm run start-watch` will bring up the server in watch mode with Nodemon).
6) Run `npm start` inside the `app` directory. This will start the webpack dev server.
7) Navigate to `http://localhost:3000`

Please note that this is currently an innovation project and does not contain any tests.

## Environment Variables

The following environment variables can be set in a `.env` file inside the `server` directory:


- TOPIC_NAME - The name of the Kafka topic you want to consume messages from. _**Required**_
- KAFKA_HOST - The list of Kafka hosts. This can be one or many separated with commas (no spaces). For local development set to `localhost:9092`. _**Required**_
- PORT=3001 - The server port.  _**Required**_

## Project Overview

### Server

The server performs the following main functions:

1) Connects to the provided Kafka host and registers as a consumer on the provided topic name.
2) Allows the front end to connect via a socket connection (Socket.io)
3) Listens to messages on the Kafka topic, and counts the number of each message type
4) Emits an object containing all the message counts to all connected front end clients on a set interval

The server also serves the front end app.

### App

The front end app is built with React, its main functions are:

1) On startup, opens a socket connection to the server
2) When the server emits the message counts, updates the visualiser which is an animated HTML canvas. Each message type is represented with its own "row". In that row, the circles represent messages. The larger the circle, the more messages of that type that were received in the last interval.

The app can also be configured by clicking the cog icon. Inside here the user can:

1) Choose which messages to show on the visualiser by selecting/deselecting them.
2) Choose whether to show trend graphs that show the number of messages per second being received. The trend graphs can be configured in terms of how often they refresh, and how much time they cover.

These options are saved to a cookie so will not be lost if the user refreshes the page.