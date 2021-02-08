const consola = require('consola');
const Hapi = require('@hapi/hapi');
const HapiNuxt = require('@nuxtjs/hapi');
const logger = require('./logger');
const secrettoken = require('./config/token');
const serverconfig = require('./config/server.config');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const mongo = require('mongodb');

const server = new Hapi.Server({
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 3000,
});

// bring your own validation function
const validate = async function (decoded, request, h) {
  const mongos = request.server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db('claim-now');
  const collection = db.collection('users');
  const object_id = new mongo.ObjectID(decoded.id);
  const query = { _id: object_id };
  let user = await collection.findOne(query);
  logger.info('token: ' + decoded + ' --> ' + JSON.stringify(decoded));
  if (user) {
    h.user = user;
    logger.info('logged User: ' + JSON.stringify(user));
    return { isValid: true };
  } else {
    logger.error('logged User: ' + JSON.stringify(user) + ' not valid');
    return { isValid: false };
  }
};

const dbOpts = {
  connection: [{ uri: serverconfig.DATABASE, name: 'mongoDb' }],
  options: {
    native_parser: false,
  },
};

async function start() {
  logger.info('NODE_ENV: ' + process.env.NODE_ENV);
  if (process.env.NODE_ENV == 'test') {
    return;
  }
  logger.info('MONGO_PATH: ' + serverconfig.DATABASE);
  logger.info('URI: ' + process.env.URI);

  //await
  await server.register({
    plugin: HapiNuxt,
    options: {},
  });

  await server.register(require('hapi-auth-jwt2'));
  server.auth.strategy('jwt', 'jwt', {
    key: secrettoken,
    validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  await server.register({
    plugin: require('hapi-multi-mongo'),
    options: dbOpts,
  });

  await server.register({
    plugin: require('hapi-router'),
    options: {
      routes: '**/*.route.js', // uses glob to include files
    },
  });

  if (process.env.NODE_ENV === 'development') {
    const swaggerOptions = {
      info: {
        title: 'APP-Server API Documentation',
        version: '1.0.0',
        contact: {
          name: 'Simon Süwer',
          email: 'simon.suewer@stud.hs-hannover.de',
        },
      },
      schemes: ['http'],
      host: process.env.URI.split('//')[1],
      grouping: 'tags',
    };

    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);
  }

  await server.start();

  consola.ready({
    message: `Server running at: ${server.info.uri}`,
    badge: true,
  });
}

process.on('unhandledRejection', (error) => consola.error(error));

start();

module.exports = {
  server: server,
};
