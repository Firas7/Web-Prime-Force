const contracts = require('./collection-service').contracts;
const mongo = require('mongodb');
const logger = require('../logger');
/** @module service/contract */

/**
 *
 *
 * @param {*} id
 * @returns mongo update object
 */
async function deleteByContractId(id) {
  const collection = contracts();

  try {
    return await collection.deleteOne({ _id: new mongo.ObjectID(id) });
  } catch (err) {
    logger.error('[contract.service.js] getAll () ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @param {*} contract
 * @returns mongo update object
 */
async function updateByContractId(id, contract) {
  const collection = contracts();

  try {
    contract.partnerId = new mongo.ObjectID(contract.partnerId);
    return await collection.findOneAndUpdate(
      { _id: new mongo.ObjectID(id) },
      { $set: contract }
    );
  } catch (err) {
    logger.error(
      '[contract.service.js] updateByContractId (' + id + ') ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} beginAtIndex
 * @param {*} limit
 * @returns contracts
 */
async function getAll(beginAtIndex, limit) {
  const collection = contracts();
  try {
    return await collection
      .find()
      .sort({ $natural: -1 })
      .skip(beginAtIndex)
      .limit(limit)
      .toArray();
  } catch (err) {
    logger.error('[contract.service.js] getAll() ' + err);
    return false;
  }
}
async function getAllAuthCount(auth) {
  const collection = contracts();
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
        { $group: { _id: null, n: { $sum: 1 } } },
      ])
      .toArray();
  } catch (err) {
    logger.error(
      '[get-claim-case.service.js] getAllAuthCount(' +
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
 * @param {*} beginAtIndex
 * @param {*} limit
 * @param {*} auth
 * @returns contracts
 */
async function getAllAuth(beginAtIndex, limit, auth) {
  const collection = contracts();
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
        { $sort: { _id: -1 } },
        { $skip: beginAtIndex },
        { $limit: limit },
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
 * @returns int
 */
async function getNumberOfDocuments() {
  const collection = contracts();
  try {
    return await collection.countDocuments();
  } catch (err) {
    logger.error('[contract.service.js] getNumberOfDocuments ' + err);
  }
}

/**
 *
 *
 * @param {*} contract
 * @returns mongo update object
 */
async function createByContractId(contract) {
  const collection = contracts();

  try {
    contract.partnerId = new mongo.ObjectID(contract.partnerId);
    return await collection.insertOne(contract);
  } catch (err) {
    logger.error(
      '[contract.service.js] createByContractId (' +
        JSON.stringify(contract) +
        ') ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} partnerId
 * @returns contract
 */
async function getByPartnerId(partnerId) {
  const collection = contracts();

  try {
    return await collection
      .find({ partnerId: new mongo.ObjectID(partnerId) })
      .toArray();
  } catch (err) {
    logger.error('[contract.service.js] getByPartnerId() ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} contractId
 * @returns contract
 */
async function getByContractId(contractId) {
  const collection = contracts();
  try {
    return await collection
      .find({ _id: new mongo.ObjectID(contractId) })
      .toArray();
  } catch (err) {
    logger.error('[contract.service.js] getByContractId() ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} search
 * @returns contracts
 */
async function search(search) {
  const collection = contracts();

  let result = [];
  try {
    result = await collection
      .aggregate([
        {
          $match: {
            $or: [
              { insurancepapernumber: { $in: search } },
              {
                branch: { $in: search },
              },
              {
                productname: { $in: search },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            insurancepapernumber: 1,
            branch: 1,
            productname: 1,
            partnerId: 1,
          },
        },
      ])
      .toArray();
  } catch (err) {
    logger.error('[getBySearchTerm] (' + search + '2) ==> ' + err);
  }

  return result;
}

module.exports = {
  deleteByContractId: deleteByContractId,
  updateByContractId: updateByContractId,
  getAll: getAll,
  getNumberOfDocuments: getNumberOfDocuments,
  createByContractId: createByContractId,
  getByPartnerId: getByPartnerId,
  getByContractId: getByContractId,
  search: search,
  getAllAuth: getAllAuth,
  getAllAuthCount: getAllAuthCount,
};
