const { createContainer, asValue, asFunction } = require('awilix');
const kafka = require('kafka-node');
const express = require('express');
const { promisify } = require('util');

const server = require('./server');

const container = createContainer();

container.register({
  kafka: asValue(kafka),
  promisify: asValue(promisify),
  app: asFunction(express).singleton(),
  server: asFunction(server).singleton(),
});

module.exports = container.cradle;
