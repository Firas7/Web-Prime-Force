const consola = require('consola');
const Hapi = require('@hapi/hapi');
const logger = require('../logger');
const secrettoken = require('../config/token');
const serverconfig = require('../config/server.config');
const mongo = require('mongodb');

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

const testserver = new Hapi.Server({
  host: process.env.HOST || '127.0.0.1',
  port: 3003,
});

async function init() {
  await testserver.register(require('hapi-auth-jwt2'));
  testserver.auth.strategy('jwt', 'jwt', {
    key: secrettoken,
    validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] },
  });

  testserver.auth.default('jwt');

  await testserver.register({
    plugin: require('hapi-multi-mongo'),
    options: dbOpts,
  });

  await testserver.register({
    plugin: require('hapi-router'),
    options: {
      routes: '**/*.route.js', // uses glob to include files
    },
  });
  await testserver.start();

  consola.ready({
    message: `Server running at: ${testserver.info.uri}`,
    badge: true,
  });
  return testserver;
}

module.exports = {
  init: init,
  testserver: testserver,
};
