/* eslint-disable no-console */

const { createContainer, asValue, asFunction } = require('awilix');
const kafka = require('kafka-node');
const express = require('express');
const socketIO = require('socket.io');
const { promisify } = require('util');
const cors = require('cors');

const getEnvVar = require('./getEnvVar');
const server = require('./server');
const consumer = require('./consumer');
const constants = require('./constants');

const container = createContainer();

let envVariables;

try {
  envVariables = {
    PORT: getEnvVar('PORT', 3000),
    TOPIC_NAME: getEnvVar('TOPIC_NAME'),
    KAFKA_HOST: getEnvVar('KAFKA_HOST'),
  };
} catch (err) {
  console.error(err, 'Error while loading environment variables');
  process.exit(1);
}

container.register({
  kafka: asValue(kafka),
  promisify: asValue(promisify),
  app: asFunction(express).singleton(),
  server: asFunction(server).singleton(),
  envVariables: asValue(envVariables),
  socketIO: asValue(socketIO),
  cors: asValue(cors),
});

container.register({
  constants: asValue(constants),
  consumer: asFunction(consumer).singleton(),
});

module.exports = container.cradle;
