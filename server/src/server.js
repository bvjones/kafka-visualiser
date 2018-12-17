/* eslint-disable no-console */

module.exports = ({ app, promisify }) => {
  let server;

  return {
    start: async () => {
      try {
        server = app.listen(3000, () => {
          console.log('Application Ready');
          console.log(`Listening on ${server.address().port}`);
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
      } catch (err) {
        console.error({ err }, 'Forcing server to shut down');
        process.exit(1);
      }
    },
  };
};
