'use strict';
const logger = require('../logger');
const users = require('./collection-service').users;
const mongo = require('mongodb');
/** @module service/user */

/**
 *
 *
 * @param {*} t
 * @returns user
 */
async function getUser(t) {
  const collection = users();
  const lowerEmail = t.toLowerCase();
  const query = { email: lowerEmail };
  try {
    return await collection.findOne(query).then((item) => {
      logger.info('Successfully found ' + JSON.stringify(item));
      return item;
    });
  } catch (err) {
    logger.error('getUser(' + t + ') Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} userId
 * @returns user
 */
async function getUserById(userId) {
  const collection = users();
  try {
    const object_id = new mongo.ObjectID(userId);
    return await collection.findOne({ _id: object_id });
  } catch (err) {
    logger.error('[user.service.js] getUserById(' + userId + ') Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} user
 * @returns mongo create object
 */
function createUser(user) {
  const collection = users();

  try {
    collection.insertOne(user);
    return true;
  } catch (err) {
    logger.error('createUser(' + user + ') Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns boolean
 */
async function completeRegById(id) {
  const collection = users();
  const object_id = new mongo.ObjectID(id);
  try {
    await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          valid: true,
          'token.registerToken': null,
        },
      }
    );
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} passwordToken
 * @returns user
 */
async function getUserByResetToken(passwordToken) {
  const collection = users();
  const query = { 'token.passwordResetToken': passwordToken };

  try {
    return await collection.findOne(query).then((item) => {
      if (item === null) {
        logger.info("Couldn't find user with query: " + JSON.stringify(query));
      } else {
        logger.info('Successfully found ' + JSON.stringify(item));
      }
      return item;
    });
  } catch (error) {
    logger.error('getUser failed with' + JSON.stringify(query));
    return false;
  }
}

/**
 *
 *
 * @param {*} regToken
 * @returns user
 */
async function getUserByRegToken(regToken) {
  const collection = users();
  const query = { 'token.registerToken': regToken };

  try {
    return await collection.findOne(query).then((item) => {
      if (item === null) {
        logger.info("Couldn't find user with query: " + JSON.stringify(query));
      } else {
        logger.info('Successfully found ' + JSON.stringify(item));
      }
      return item;
    });
  } catch (error) {
    logger.error('getUser failed with' + JSON.stringify(query));
    return false;
  }
}

/**
 *
 *
 * @param {*} userId
 * @param {*} passwordHash
 * @returns boolean
 */
async function updateUserPassword(userId, passwordHash) {
  const collection = users();
  const object_id = new mongo.ObjectID(userId);

  try {
    await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          password: passwordHash,
          'token.passwordResetToken': null,
          'token.passwordResetExpiryDate': null,
        },
      }
    );
    logger.info('Reset ' + userId + ' password.');
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} userId
 * @param {*} passwordResetToken
 * @returns boolean
 */
async function updateResetToken(userId, passwordResetToken) {
  const collection = users();
  /* 1 das expiry time for password token */
  const passwordResetExpiryDate = Date.now() + 86400000;
  const object_id = new mongo.ObjectID(userId);

  try {
    await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          'token.passwordResetToken': passwordResetToken,
          'token.passwordResetExpiryDate': passwordResetExpiryDate,
        },
      }
    );
    logger.info(
      'Updated ' +
        userId +
        ' password reset token. Token: ' +
        passwordResetToken
    );
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} userId
 * @param {*} agentId
 * @returns boolean
 */
async function updateLinkUserAgent(userId, agentId) {
  const collection = users();
  const object_id = new mongo.ObjectID(userId);
  const object_id_agent = new mongo.ObjectID(agentId);
  try {
    await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          'linkedAgent.agentId': object_id_agent,
        },
      }
    );
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} userId
 * @param {*} linkToken
 * @param {*} partnerId
 * @returns boolean
 */
async function updateLinkUserInsuredToken(userId, linkToken, partnerId) {
  const collection = users();
  const linkTokenExpiryDate = Date.now() + 86400000;
  const object_id = new mongo.ObjectID(userId);
  const object_id_partner = new mongo.ObjectID(partnerId);
  try {
    await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          'linkedPartner.partnerId': object_id_partner,
          'linkedPartner.confirmed': false,
          'token.linkUserInsuredToken': linkToken,
          'token.linkTokenExpiryDate': linkTokenExpiryDate,
        },
      }
    );
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} userId
 * @returns boolean
 */
async function confirmLinkUserInsuredToken(userId) {
  const collection = users();
  const object_id = new mongo.ObjectID(userId);
  try {
    await collection.findOneAndUpdate(
      { _id: object_id },
      {
        $set: {
          'linkedPartner.confirmed': true,
          'token.linkUserInsuredToken': null,
        },
      }
    );
    logger.info('Updated ' + userId);
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
}

module.exports = {
  getUser: getUser,
  getUserById: getUserById,
  createUser: createUser,
  completeRegById: completeRegById,
  updateUserPassword: updateUserPassword,
  updateResetToken: updateResetToken,
  getUserByResetToken: getUserByResetToken,
  getUserByRegToken: getUserByRegToken,
  updateLinkUserAgent: updateLinkUserAgent,
  updateLinkUserInsuredToken: updateLinkUserInsuredToken,
  confirmLinkUserInsuredToken: confirmLinkUserInsuredToken,
};
