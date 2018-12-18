/* eslint-disable no-console */

const { createContainer, asValue, asFunction } = require('awilix');
const kafka = require('kafka-node');
const express = require('express');
const { promisify } = require('util');
const getEnvVar = require('./getEnvVar');

const server = require('./server');
const consumer = require('./consumer');

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
});

container.register({
  consumer: asFunction(consumer).singleton(),
});

module.exports = container.cradle;
