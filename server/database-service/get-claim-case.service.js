'use strict';
const logger = require('../logger');
const claimcases = require('./collection-service').claimcases;
const mongo = require('mongodb');

/** @module service/claim */

/**
 *
 *
 * @param {*} id
 * @returns claim
 */
async function getClaimCase(id) {
  const collection = claimcases();
  const object_id = new mongo.ObjectID(id);
  try {
    return await collection.findOne({ _id: object_id });
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getClaimCase(' + id + ') Error: ' + err
    );
    return false;
  }
}
/**
 *
 *
 * @param {*} partnerId
 * @returns claim
 */
async function getByPartnerId(partnerId) {
  const collection = claimcases();
  partnerId = new mongo.ObjectID(partnerId);
  try {
    return await collection.find({ partnerId: partnerId }).toArray();
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getByPartnerId(' +
        partnerId +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} contractID
 * @returns claim
 */
async function getClaimCasesByContractID(contractID) {
  const collection = claimcases();
  const object_id = new mongo.ObjectID(contractID);
  try {
    return await collection.find({ contractID: object_id }).toArray();
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getClaimCasesByContractID(' +
        contractID +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} auth
 * @returns claims
 */
async function getClaimCasesForAuth(auth) {
  const collection = claimcases();
  try {
    return await collection
      .aggregate([
        {
          $match: {
            $or: [
              {
                $and: [
                  { auth: { $exists: true } },
                  {
                    'auth.branch': auth.branch,
                  },
                  { 'auth.level': { $gte: auth.level } },
                ],
              },
              { auth: { $exists: false } },
            ],
          },
        },
      ])
      .toArray();
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getClaimCasesForAuth(' +
        JSON.stringify(auth) +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} secret
 * @returns claim
 */
async function getClaimCaseWithSecret(secret) {
  const collection = claimcases();

  try {
    return await collection.findOne({ secret: secret });
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getClaimCaseWithSecret(' +
        secret +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @returns claims
 */

async function getAllClaimcases() {
  const collection = claimcases();
  try {
    return await collection.find().toArray();
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getAllClaimcases() Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} secret
 * @returns claim
 */
async function getClaimCaseBySecret(secret) {
  const collection = claimcases();
  try {
    return await collection.findOne({ secret: secret });
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getClaimCaseBySecret: (' +
        secret +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} partnerId
 * @returns int
 */
async function countPerStateUser(partnerId) {
  const collection = claimcases();
  const object_id = new mongo.ObjectID(partnerId);
  try {
    return await collection
      .aggregate([
        { $match: { partnerId: object_id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
      .toArray();
  } catch (err) {
    logger.error(
      '[claim-case.service.js] getCcountPerStateUserlaimCase(' +
        partnerId +
        ') Error: ' +
        err
    );
    return [];
  }
}

/**
 *
 *
 * @param {*} auth
 * @returns int
 */
async function countPerStateAuth(auth) {
  const collection = claimcases();
  try {
    return await collection
      .aggregate([
        {
          $match: {
            $or: [
              {
                $and: [
                  { auth: { $exists: true } },
                  {
                    'auth.branch': auth.branch,
                  },
                  { 'auth.level': { $gte: auth.level } },
                ],
              },
              { auth: { $exists: false } },
            ],
          },
        },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
      .toArray();
  } catch (err) {
    logger.error('[claim-case.controller.js] countPerStateAll() Error: ' + err);
    return [];
  }
}

/**
 *
 *
 * @returns int
 */
async function countPerStateAll() {
  const collection = claimcases();
  try {
    return await collection
      .aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
      .toArray();
  } catch (err) {
    logger.error('[claim-case.controller.js] countPerStateAll() Error: ' + err);
    return [];
  }
}

/**
 *
 *
 * @param {*} partnerId
 */
async function countPerCreateUser(partnerId) {
  //const collection = claimcases();
  logger.error('NOT YET IMPLEMNTED' + partnerId);
}

/**
 *
 *
 * @param {*} auth
 */
async function countPerCreateAuth(auth) {
  //const collection = claimcases();
  logger.error('NOT YET IMPLEMNTED' + auth);
}

/**
 *
 *
 */
async function countPerCreateAll() {
  //const collection = claimcases();
  logger.error('NOT YET IMPLEMNTED');
}

module.exports = {
  getClaimCase: getClaimCase,
  getAllClaimcases: getAllClaimcases,
  getClaimCasesByContractID: getClaimCasesByContractID,
  getByPartnerId: getByPartnerId,
  getClaimCaseWithSecret: getClaimCaseWithSecret,
  getClaimCaseBySecret: getClaimCaseBySecret,
  getClaimCasesForAuth: getClaimCasesForAuth,
  countPerStateUser: countPerStateUser,
  countPerStateAll: countPerStateAll,
  countPerCreateAll: countPerCreateAll,
  countPerCreateUser: countPerCreateUser,
  countPerStateAuth: countPerStateAuth,
  countPerCreateAuth: countPerCreateAuth,
};
