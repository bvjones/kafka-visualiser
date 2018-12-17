const { server } = require('./container');

process.on('SIGTERM', server.stop);
process.on('SIGINT', server.stop);

server.start();
