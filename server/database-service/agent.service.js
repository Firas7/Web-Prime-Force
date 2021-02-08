'use strict';
const logger = require('../logger');
const agent = require('./collection-service').agent;
const mongo = require('mongodb');
/** @module service/agent */

/**
 *
 *
 * @param {*} id
 * @returns agent
 */
async function getById(id) {
  const collection = agent();
  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOne({ _id: object_id });
  } catch (err) {
    logger.error('[agent.service.js] getById (' + id + ') Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} agentPerson
 * @returns mongo insert object
 */
async function createAgent(agentPerson) {
  const collection = agent();

  try {
    return await collection.insertOne(agentPerson);
  } catch (err) {
    logger.error(
      '[agent.service.js] createAgent (' +
        JSON.stringify(agentPerson) +
        ') Error: ' +
        err
    );
    return false;
  }
}

module.exports = {
  getById: getById,
  createAgent: createAgent,
};
