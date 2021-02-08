'use strict';
const logger = require('../logger');
const clerk = require('./collection-service').clerk;
const mongo = require('mongodb');

/** @module service/clerk */

/**
 *
 *
 * @param {*} id
 * @returns clerk
 */
async function getById(id) {
  const collection = clerk();
  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOne({ _id: object_id });
  } catch (err) {
    logger.error('[clerk.service.js] getById (' + id + ') Error: ' + err);
    return false;
  }
}

async function getImageByUserId(userId) {
  const collection = clerk();
  try {
    const object_id = new mongo.ObjectID(userId);
    respone = await collection.findOne({ _id: object_id });
    faceimage = response.data.faceImage;
    return faceimage;
  } catch (err) {
    logger.error('[clerk.service.js] getById (' + id + ') Error: ' + err);
    return false;
  }
}

module.exports = {
  getById: getById,
  getImageByUserId: getImageByUserId,
};
