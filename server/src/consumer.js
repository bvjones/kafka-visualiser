module.exports = ({ kafka, envVariables }) => {
  const { Consumer } = kafka;

  let consumer;

  return {
    start: () => {
      const client = new kafka.KafkaClient({
        kafkaHost: envVariables.KAFKA_HOST,
      });
      consumer = new Consumer(client, [{ topic: process.env.TOPIC_NAME }]);

      consumer.on('message', message => {
        console.log(message);
      });
    },
    stop: () => {
      consumer.close(true, err => {
        console.error(err);
      });
    },
  };
};
