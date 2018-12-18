/* eslint-disable no-console */

const kafka = require('kafka-node');

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

const eventTypes = ['ChrisLovesKafka', 'JoshMakeTea', 'AlbertIsAwesome'];

producer.on('ready', () => {
  setInterval(() => {
    producer.send(
      [
        {
          topic: process.env.TOPIC_NAME,
          messages: [
            JSON.stringify({
              metadata: {
                eventName:
                  eventTypes[Math.floor(Math.random() * eventTypes.length)],
              },
            }),
          ],
        },
      ],
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
