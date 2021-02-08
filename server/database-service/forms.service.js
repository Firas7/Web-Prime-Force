'use strict';
const logger = require('../logger');
const claimcases = require('./collection-service').claimcases;
const forms = require('./collection-service').forms;
const mongo = require('mongodb');
/** @module service/forms */

/**
 *
 *
 * @returns forms
 */
async function getAllForms() {
  const collection = forms();
  try {
    return await collection.find({}).toArray();
  } catch (err) {
    logger.error('[forms.controller.js] getAllForms ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} branch
 * @param {*} version
 * @returns form
 */
async function getFormByVersion(branch, version) {
  const collection = forms();
  try {
    return await collection.findOne({ branch: branch, version: version });
  } catch (err) {
    logger.error('[forms.controller.js] getFormByVersion ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} branch
 * @param {*} version
 * @param {*} form
 * @returns mongo update object
 */
async function updateForm(branch, version, form) {
  const collection = forms();
  try {
    return await collection.findOneAndUpdate(
      { branch: branch, version: version },
      { $set: form }
    );
  } catch (err) {
    logger.error(
      '[form.controller.js] updateForm (' + branch + ' ' + version + ') ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} form
 * @returns mongo update object
 */
async function postNewForm(form) {
  const collection = forms();
  try {
    return await collection.insertOne(form);
  } catch (err) {
    logger.error('postNewForm(' + form + ') ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} payload
 * @param {*} token
 * @returns mongo update object
 */
async function postNewClaim(payload, token) {
  const collection = claimcases();
  payload.partnerId = new mongo.ObjectID(payload.partnerId);
  payload.contractId = new mongo.ObjectID(payload.contractId);
  payload.history = {
    creationDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };

  try {
    return await collection.insertOne({
      ...payload,
      secret: token,
    });
  } catch (err) {
    logger.error('postNewClaim(' + payload + ') Error:' + err);
    return false;
  }
}

module.exports = {
  getAllForms: getAllForms,
  getFormByVersion: getFormByVersion,
  updateForm: updateForm,
  postNewForm: postNewForm,
  postNewClaim: postNewClaim,
};
