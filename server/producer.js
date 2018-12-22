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

const eventTypes = [
  'ChrisLovesKafka',
  'JoshMakeTea',
  'AlbertIsAwesome',
  // 'BenAndRick=TheBest',
  // 'helloMG',
  // 'ChrisLovesKafka2',
  // 'JoshMakeTea2',
  // 'AlbertIsAwesome2',
  // 'BenAndRick=TheBest2',
  // 'helloMG2',
  // 'DanAbramov',
  // 'JoshMakeTea3',
  // 'AlbertIsAwesome3',
  // 'BenAndRick=TheBest3',
  // 'helloMG3',
  // 'ChrisLovesKafka4',
  // 'JoshMakeTea4',
  // 'AlbertIsAwesome4',
  // 'BenAndRick=TheBest4',
  // 'Urmo',
  // 'ChrisLovesKafka5',
  // 'spock',
  // 'AlbertIsAwesome5',
  // 'BenAndRick=TheBest5',
  // 'helloMG5',
];

producer.on('ready', () => {
  console.log('Producing events');
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
      err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      },
    );
  }, 250);
});

producer.on('error', err => {
  console.error('Producer error: ', err);
});
