/* eslint-disable no-console */

const kafka = require('kafka-node');
const uuid = require('uuid').v4;
const _ = require('lodash');

const { Producer } = kafka;

const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST });
const producer = new Producer(client);

client.on('connect', () => {
  console.log('client connected');
  client.createTopics(
    [{ topic: process.env.TOPIC_NAME, partitions: 1, replicationFactor: 1 }],
    error => {
      console.error(error);
    },
  );
});

producer.on('ready', () => {
  setInterval(() => {
    producer.send(
      [{ topic: process.env.TOPIC_NAME, message: uuid }],
      (err, data) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log('Sending data: ', data);
      },
    );
  }, 1000);
});

producer.on('error', err => {
  console.error('YOU FUCKED IT: ', err);
});
