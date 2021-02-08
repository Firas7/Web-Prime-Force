const dbConnection = require('./collection-service');
const mongo = require('mongodb');
const logger = require('../logger');
/** @module service/profile */

/**
 *
 *
 * @param {*} profile
 * @param {*} id
 * @returns mongo update project
 */
async function updatetProfileById(profile, id) {
  const collection = dbConnection.users();
  const object_id = new mongo.ObjectID(id);
  try {
    return await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          email: profile.email,
          'coredata.firstname': profile.firstname,
          'coredata.lastname': profile.lastname,
        },
      }
    );
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns profile
 */
async function getProfileById(id) {
  const collection = dbConnection.users();
  const object_id = new mongo.ObjectID(id);
  try {
    const object = await collection
      .find({ _id: object_id })
      .project({ _id: 1, email: 1, valid: 1, coredata: 1, linkedPartner: 1 })
      .toArray();
    if (object.length > 0) {
      return object[0];
    } else {
      false;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns profile
 */

async function getProfileByPartnerId(id) {
  const collection = dbConnection.users();
  const object_id = new mongo.ObjectID(id);
  try {
    const object = await collection
      .find({ 'linkedPartner.partnerId': object_id })
      .project({ _id: 1, email: 1, valid: 1, coredata: 1, linkedPartner: 1 })
      .toArray();
    if (object.length > 0) {
      return object[0];
    } else {
      false;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
}

module.exports = {
  updatetProfileById: updatetProfileById,
  getProfileById: getProfileById,
  getProfileByPartnerId: getProfileByPartnerId,
};
