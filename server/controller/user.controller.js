'use strict';
const ao = require('../database-service/user.service');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const logger = require('../logger');
const crypto = require('crypto');

/** @module controller/user */

/**
 *
 *
 * @param {*} password
 * @returns hash
 */
function hashPassword(password) {
  const saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

/**
 *
 *
 * @returns random Password
 */
function generateRandomPassword() {
  return crypto.randomBytes(5).toString('hex');
}

/**
 *
 *
 * @param {*} request
 * @returns payload
 */
async function verifyUniqueUser(request) {
  // Find an entry from the database that
  let user = await ao.getUser(request.payload.email.toLowerCase());
  if (user != null) {
    return Boom.badRequest('Email taken');
  }
  logger.info('verifyUniqueUser found ' + JSON.stringify(user));
  return request.payload;
}

/**
 *
 *
 * @param {*} request
 * @returns user
 */
async function verifyCredentials(request) {
  const password = request.payload.password;

  let user = await ao.getUser(request.payload.email.toLowerCase());

  if (user != null) {
    logger.info('user ' + JSON.stringify(user));
    return bcrypt.compareSync(password, user.password)
      ? user
      : Boom.badRequest('Incorrect password!');
  } else {
    return Boom.badRequest('Incorrect email!');
  }
}

/**
 *
 *
 * @param {*} user
 * @returns partnerid
 */
async function checkUserObjectPartner(user) {
  user = await ao.getUser(user.email);

  logger.info(JSON.stringify(user));
  if (user == null) {
    logger.info('return 1');
    return null;
  }
  if (user.linkedPartner == null) {
    logger.info('return 2');
    return null;
  }

  if (!user.linkedPartner.confirmed) {
    logger.info('return 3');
    return null;
  }
  return user.linkedPartner.partnerId;
}

/**
 *
 *
 * @param {*} user
 * @returns auth objet
 */
async function checkUserObjectAuth(user) {
  user = await ao.getUser(user.email);

  logger.info(JSON.stringify(user));
  if (user == null) {
    logger.info('return 1');
    return null;
  }
  if (user.auth == null) {
    logger.info('return 2');
    return null;
  }

  return user.auth;
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials,
  hashPassword: hashPassword,
  generateRandomPassword: generateRandomPassword,
  checkUserObjectPartner: checkUserObjectPartner,
  checkUserObjectAuth: checkUserObjectAuth,
};
