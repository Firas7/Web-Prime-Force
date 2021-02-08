'use strict';
const logger = require('../logger');
const mail = require('./collection-service').mail;
/** @module service/profile */

/**
 *
 *
 * @param {*} sendMail
 * @param {*} res
 * @param {*} payload
 * @param {*} status
 * @returns boolean
 */
async function safeMail(sendMail, res, payload, status) {
  const collection = mail();
  const m = {};
  m.mail = sendMail;
  m.response = JSON.parse(JSON.stringify(res, getCircularReplacer()));
  m.payload = payload;
  m.status = status;
  try {
    await collection.insertOne(m);
    return true;
  } catch (err) {
    logger.error('safeMail(' + m + ') Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @returns object
 */
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

module.exports = {
  safeMail: safeMail,
};
