/* eslint-disable no-console */

module.exports = ({ app, promisify, consumer, socketIO }) => {
  let server;
  let io;

  return {
    start: async () => {
      try {
        server = app.listen(3000, () => {
          console.log('Application Ready');
          console.log(`Listening on ${server.address().port}`);

          io = socketIO(server);

          io.on('connection', socket => {
            socket.emit('news', { hello: 'world' });
            socket.on('my other event', data => {
              console.log(data);
            });
          });

          consumer.start();
        });
      } catch (err) {
        console.error({ err }, 'Failed to start up');
        process.exit(1);
      }

      return server;
    },
    stop: async () => {
      try {
        await promisify(server.close).call(server);
        consumer.stop();
      } catch (err) {
        console.error({ err }, 'Forcing server to shut down');
        process.exit(1);
      }
    },
  };
};
