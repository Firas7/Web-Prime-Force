const tenants = require('./collection-service').tenants;
const mongo = require('mongodb');
const logger = require('../logger');
/** @module service/tantant */

/**
 *
 *
 * @param {*} id
 * @returns mongo delete object
 */
async function deleteById(id) {
  const collection = tenants();
  const object_id = new mongo.ObjectID(id);

  try {
    return await collection.deleteOne({ _id: object_id });
  } catch (err) {
    logger.error('[tenant.service.js] deleteById() ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @param {*} tenant
 * @returns mongo update object
 */
async function updateById(id, tenant) {
  const collection = tenants();
  const object_id = new mongo.ObjectID(id);

  try {
    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: tenant }
    );
  } catch (err) {
    logger.error('[tenant.service.js] updateById() ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} beginAtIndex
 * @param {*} limit
 * @returns tantans
 */
async function getAll(beginAtIndex, limit) {
  const collection = tenants();

  try {
    return await collection
      .find()
      .sort({ $natural: -1 })
      .skip(beginAtIndex)
      .limit(limit)
      .toArray();
  } catch (err) {
    logger.error('[tenant.service.js] getAll() ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns tantant
 */
async function getById(id) {
  const collection = tenants();
  const object_id = new mongo.ObjectID(id);

  try {
    return await collection.findOne({ _id: object_id });
  } catch (err) {
    logger.error('[tenant.service.js] getById() ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} tenant
 * @returns mongo create object
 */
async function createTenant(tenant) {
  const collection = tenants();

  try {
    return await collection.insertOne(tenant);
  } catch (err) {
    logger.error('[tenant.service.js] createTenant() ' + err);
    return false;
  }
}

/**
 *
 *
 * @returns int
 */
async function getNumberOfDocuments() {
  const collection = tenants();
  try {
    return await collection.countDocuments();
  } catch (err) {
    logger.error('[tenant.service.js] getNumberOfDocuments ' + err);
  }
}

module.exports = {
  deleteById: deleteById,
  updateById: updateById,
  getAll: getAll,
  getById: getById,
  createTenant: createTenant,
  getNumberOfDocuments: getNumberOfDocuments,
};
