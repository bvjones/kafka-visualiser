/* eslint-disable no-console */
const path = require('path');
const helmet = require('helmet');
const expressStaticGzip = require('express-static-gzip');

module.exports = ({
  app,
  promisify,
  consumer,
  socketIO,
  envVariables,
  cors,
}) => {
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
            contentSecurityPolicy: false,
          }),
        );
        app.use(cors());

        const srcFolder = '../../app/build';

        app.get('/private/liveness', (req, res) => {
          res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.status(200).send('pong');
        });

        app.get('/private/readiness', (req, res) => {
          res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.status(200).send('pong');
        });

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

          io = socketIO(server, { cors: true, origins: '*:*' });

          let connections = 0;
          io.on('connection', (socket) => {
            connections += 1;
            console.log('Connection established', socket.id);
            console.log(`Total connections: ${connections}`);
          });

          let aggregatedEvents = {};

          consumerInstance.on('message', (message) => {
            let value;

            try {
              value = JSON.parse(message.value);
            } catch (err) {
              console.error('Error when parsing event', err);
              return;
            }
            const { eventName } = value.metadata;

            aggregatedEvents = {
              ...aggregatedEvents,
              [eventName]: {
                count: aggregatedEvents[eventName]
                  ? aggregatedEvents[eventName].count + 1
                  : 1,
              },
            };
          });

          setInterval(() => {
            if (Object.keys(aggregatedEvents).length > 0) {
              io.emit('kafkaEvents', aggregatedEvents);
              aggregatedEvents = {};
            }
          }, 250);
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
