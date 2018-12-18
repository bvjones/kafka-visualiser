/* eslint-disable no-console */
const path = require('path');
const helmet = require('helmet');

module.exports = ({ app, promisify, consumer, socketIO, envVariables }) => {
  let server;
  let io;

  return {
    start: async () => {
      try {
        app.use(
          helmet({
            frameguard: {
              action: 'deny',
            },
          }),
        );

        app.use((req, res, next) =>
          (req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')
            ? res.sendFile(
                path.resolve(__dirname, '../../app/build', 'index.html'),
                next,
              )
            : next(),
        );

        server = app.listen(envVariables.PORT, () => {
          console.log('Application Ready');
          console.log(`Listening on ${server.address().port}`);
          const consumerInstance = consumer.start();

          io = socketIO(server);

          io.on('connection', socket => {
            consumerInstance.on('message', message => {
              console.log('Got message', message);
              socket.emit('kafkaEvent', message);
            });
          });
        });
      } catch (err) {
        console.error({ err }, 'Failed to start up');
        process.exit(1);
      }

      return server;
    },
    stop: async () => {
      try {
        consumer.stop();
        await promisify(server.close).call(server);
      } catch (err) {
        console.error({ err }, 'Forcing server to shut down');
        process.exit(1);
      }
    },
  };
};
