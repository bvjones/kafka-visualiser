module.exports = ({ kafka, envVariables }) => {
  const { Consumer } = kafka;

  let consumer;

  return {
    start: () => {
      console.log('Starting Kafka consumer');
      const client = new kafka.KafkaClient({
        kafkaHost: envVariables.KAFKA_HOST,
      });
      consumer = new Consumer(client, [{ topic: process.env.TOPIC_NAME }]);
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
