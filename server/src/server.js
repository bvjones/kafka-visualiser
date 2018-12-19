/* eslint-disable no-console */
const path = require('path');
const helmet = require('helmet');
const expressStaticGzip = require('express-static-gzip');

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

        const srcFolder = '../../app/build';

        app.use(
          '/',
          expressStaticGzip(path.join(__dirname, srcFolder), {
            maxAge: '24h',
          }),
        );

        server = app.listen(envVariables.PORT, () => {
          console.log('Application Ready');
          console.log(`Listening on ${server.address().port}`);
          const consumerInstance = consumer.start();

          io = socketIO(server);

          io.on('connection', socket => {
            consumerInstance.on('message', message => {
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
        console.log('Stopping server');
        consumer.stop();
        await promisify(server.close).call(server);
      } catch (err) {
        console.error({ err }, 'Forcing server to shut down');
        process.exit(1);
      }
    },
  };
};
