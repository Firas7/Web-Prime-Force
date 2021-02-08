'use strict';
const server = require('../index').server;
const testserver = require('../test/testindex').testserver;
const Grid = require('gridfs-stream');
const mongo = require('mongodb');
//var mock = require('mongo-mock');

const database = 'claim-now';
const database_mail = 'mail';

function users() {
  if (process.env.NODE_ENV == 'test') {
    const mongos = testserver.plugins['hapi-multi-mongo'].mongo;
    const db = mongos.mongoDb.db(database);
    return db.collection('users');
  } else {
    const mongos = server.plugins['hapi-multi-mongo'].mongo;
    const db = mongos.mongoDb.db(database);
    return db.collection('users');
  }
}

function clerk() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('clerk');
}

function agent() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('agent');
}

function insured() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('insured');
}

function tenants() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('tenants');
}

function contracts() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('contracts');
}

function claimcases() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db('claim-now');
  return db.collection('claimcases');
}

function forms() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('forms');
}

function mail() {
  if (process.env.NODE_ENV == 'test') {
    const mongos = testserver.plugins['hapi-multi-mongo'].mongo;
    const db = mongos.mongoDb.db(database);
    return db.collection('send');
  } else {
    const mongos = server.plugins['hapi-multi-mongo'].mongo;
    const db = mongos.mongoDb.db(database_mail);
    return db.collection('send');
  }
}

function gfs() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  const gfs = Grid(db, mongo);
  return gfs;
}

function chats() {
  const mongos = server.plugins['hapi-multi-mongo'].mongo;
  const db = mongos.mongoDb.db(database);
  return db.collection('chats');
}

module.exports = {
  mail: mail,
  tenants: tenants,
  users: users,
  clerk: clerk,
  agent: agent,
  insured: insured,
  contracts: contracts,
  claimcases: claimcases,
  forms: forms,
  gfs: gfs,
  chats: chats,
};
