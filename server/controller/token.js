'use strict';

const jwt = require('jsonwebtoken');
const secret = require('../config/token');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ao = require('../database-service/user.service');

/** @module controller/token */

/**
 *
 *
 * @param {*} user
 * @param {*} app
 * @returns token
 */
function createToken(user, app) {
  let time = '2h';
  if (app) {
    time = '60 days';
  }
  return jwt.sign(
    {
      id: user._id,
      firstname: user.coredata.firstname,
      lastname: user.coredata.lastname,
      email: user.email,
      valid: user.valid,
      scope: user.scope,
    },
    secret,
    { algorithm: 'HS256', expiresIn: time }
  );
}

/**
 *
 *
 * @param {*} email
 * @returns token
 */
function createRegisterToken(email) {
  const saltRounds = 10;
  let salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(email, salt);
}

/**
 *
 *
 * @returns token
 */
async function createResetToken() {
  let token = await crypto.randomBytes(20).toString('hex');
  let user = await ao.getUserByResetToken(token);

  while (user) {
    token = await crypto.randomBytes(20).toString('hex');
    user = await ao.getUserByResetToken(token);
  }
  return token;
}

/**
 *
 *
 * @returns token
 */
async function createLinkUserInsuredToken() {
  return await crypto.randomBytes(3).toString('hex');
}

/**
 *
 *
 * @returns token
 */
async function createClaimToken() {
  return await crypto.randomBytes(20).toString('hex');
}

module.exports = {
  createToken: createToken,
  createRegisterToken: createRegisterToken,
  createResetToken: createResetToken,
  createLinkUserInsuredToken: createLinkUserInsuredToken,
  createClaimToken: createClaimToken,
};
