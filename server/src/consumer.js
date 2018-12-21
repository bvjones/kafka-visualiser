module.exports = ({ kafka, envVariables }) => {
  const { ConsumerGroup } = kafka;

  let consumer;

  return {
    start: () => {
      console.log('Starting Kafka consumer');

      consumer = new ConsumerGroup(
        { kafkaHost: envVariables.KAFKA_HOST },
        envVariables.TOPIC_NAME,
      );

      consumer.client.on('ready', () => {
        console.log('Connected to Kafka');
      });

      consumer.on('error', err => {
        console.error('Error with consumer', err);
      });

      return consumer;
    },
    stop: () => {
      consumer.close(true, err => {
        console.error(err);
      });
    },
  };
};
