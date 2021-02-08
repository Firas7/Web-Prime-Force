'use strict';
const logger = require('../logger');
const claimcases = require('./collection-service').claimcases;
const mongo = require('mongodb');

/** @module service/claim */

/**
 *
 *
 * @param {*} claimCase
 * @returns mongo update object
 */
async function createClaimCase(claimCase) {
  const collection = claimcases();

  try {
    return await collection.insertOne(claimCase);
  } catch (err) {
    logger.error(
      '[claim-case.controller.js] createClaimCase (' +
        JSON.stringify(claimCase) +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} claimCase
 * @param {*} id
 * @returns mongo update object
 */
async function updateById(claimCase, id) {
  const collection = claimcases();

  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: claimCase }
    );
  } catch (err) {
    logger.error(
      '[claim-case.controller.js] updateById (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} rating
 * @param {*} id
 * @returns mongo update object
 */
async function addRating(rating, id) {
  const collection = claimcases();

  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: { rating } },
      {
        returnOriginal: false,
        upsert: true,
        returnNewDocument: true,
      }
    );
  } catch (err) {
    logger.error(
      '[claim-case.controller.js] addRating (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} claimsum
 * @param {*} id
 * @returns mongo update object
 */
async function addSchadenssumme(claimsum, id) {
  const collection = claimcases();

  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: { schadenssumme: claimsum.schadenssumme } },
      {
        returnOriginal: false,
        upsert: true,
        returnNewDocument: true,
      }
    );
  } catch (err) {
    logger.error(
      '[claim-case.controller.js] addSchadenssumme (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} claimid
 * @param {*} imageId
 * @returns mongo update object
 */
async function addImageId(claimid, imageId) {
  const collection = claimcases();
  const object_id = new mongo.ObjectID(claimid);
  for (const key in imageId) {
    if (key == 'tags') {
      continue;
    }
    const element = imageId[key];
    const image_id = new mongo.ObjectID(element);
    imageId[key] = image_id;
  }

  try {
    await collection.findOneAndUpdate(
      { _id: object_id },

      { $addToSet: { images: imageId } }
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
 * @param {*} claimid
 * @param {*} imageIds
 * @returns mongo update object
 */
async function deleteImage(claimid, imageIds) {
  const collection = claimcases();
  const object_id = new mongo.ObjectID(claimid);
  for (const key in imageIds) {
    const element = imageIds[key];
    const image_id = new mongo.ObjectID(element);
    imageIds[key] = image_id;
  }
  return await collection.findOneAndUpdate(
    { _id: object_id },
    { $pull: { images: imageIds } }
  );
}

/**
 *
 *
 * @param {*} payload
 * @param {*} token
 * @param {*} partnerId
 * @returns mongo update object
 */
async function postNewClaimcase(payload, token, partnerId) {
  const collection = claimcases();
  const object_id_partnerId = new mongo.ObjectID(partnerId);
  payload.contractID = new mongo.ObjectID(payload.contractID);
  try {
    if (!payload.sendMail) {
      return await collection.insertOne({
        payload,
        partnerId: object_id_partnerId,
      });
    } else {
      return await collection.insertOne({
        payload,
        secret: token,
        partnerId: object_id_partnerId,
      });
    }
  } catch (err) {
    logger.error('postClaimCase(' + payload + ') Error:' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @param {*} status
 * @returns mongo update object
 */
async function updateClaimCaseStatusById(id, status) {
  logger.debug(
    'server/database-service/claim-case.service.js updateClaimCaseStatusById(' +
      Date.now() +
      ' - ID: ' +
      id +
      ', Status: ' +
      status +
      ')'
  );
  try {
    const collection = claimcases();
    return await collection.findOneAndUpdate(
      { _id: new mongo.ObjectId(id) },
      {
        $set: { status },
      },
      {
        returnOriginal: false,
        upsert: true,
        returnNewDocument: true,
      }
    );
  } catch (err) {
    logger.error('updateClaimCaseStatusById(' + id + status + ') Error:' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} claim
 * @returns mongo update object
 */
async function updateClaimCaseBySecret(claim) {
  const collection = claimcases();

  claim.partnerId = new mongo.ObjectID(claim.partnerId);
  claim.contractId = new mongo.ObjectID(claim.contractId);

  delete claim._id;
  // You should not be able to modify the claim history
  delete claim.history;
  try {
    return await collection.findOneAndUpdate(
      { secret: claim.secret },
      {
        $currentDate: {
          'history.lastModified': true,
        },
        $set: claim,
      }
    );
  } catch (err) {
    logger.error('updateClaimCaseBySecret service: (' + claim + ')' + err);
    return false;
  }
}

module.exports = {
  createClaimCase: createClaimCase,
  updateById: updateById,
  addImageId: addImageId,
  postNewClaimcase: postNewClaimcase,
  deleteImage: deleteImage,
  updateClaimCaseStatusById: updateClaimCaseStatusById,
  updateClaimCaseBySecret: updateClaimCaseBySecret,
  addRating: addRating,
  addSchadenssumme: addSchadenssumme,
};
