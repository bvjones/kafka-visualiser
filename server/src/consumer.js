module.exports = ({ kafka, envVariables, constants }) => {
  const { ConsumerGroup } = kafka;

  let consumer;

  return {
    start: () => {
      console.log('Starting Kafka consumer');

      consumer = new ConsumerGroup(
        {
          kafkaHost: envVariables.KAFKA_HOST,
          groupId: constants.KAFKA_GROUP_ID,
        },
        envVariables.TOPIC_NAME,
      );

      consumer.client.on('ready', () => {
        console.log('Connected to Kafka');
      });

      consumer.on('error', (err) => {
        console.error('Error with consumer', err);
      });

      return consumer;
    },
    stop: () => {
      consumer.close(true, (err) => {
        console.error(err);
      });
    },
  };
};
