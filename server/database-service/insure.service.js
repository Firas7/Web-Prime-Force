'use strict';
const logger = require('../logger');
const insured = require('./collection-service').insured;
const mongo = require('mongodb');
/** @module service/profile */

/**
 *
 *
 * @param {*} beginAtIndex
 * @param {*} limit
 * @returns insureds
 */
async function getAll(beginAtIndex, limit) {
  const collection = insured();
  try {
    return await collection
      .find()
      .sort({ $natural: -1 })
      .skip(beginAtIndex)
      .limit(limit)
      .toArray();
  } catch (err) {
    logger.error('[insured.service.js] getAll () Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns insured
 */
async function getById(id) {
  const collection = insured();
  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOne({ partnerId: object_id });
  } catch (err) {
    logger.error('[insured.service.js] getById (' + id + ') Error: ' + err);
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns insured
 */
async function getByInsuredId(id) {
  const collection = insured();
  const object_id = new mongo.ObjectID(id);
  return await collection.findOne({ _id: object_id }).then((item) => {
    if (item === null) {
      logger.info(
        "[insured.controller.js] Couldn't find user with query: " +
          JSON.stringify(id)
      );
    } else {
      logger.info(
        '[insured.controller.js] Successfully found ' + JSON.stringify(item)
      );
    }
    return item;
  });
}

/**
 *
 *
 * @param {*} partnerId
 * @returns insured
 */
async function getByPartnerId(partnerId) {
  const collection = insured();
  const object_id = new mongo.ObjectID(partnerId);
  return await collection.findOne({ partnerId: object_id }).then((item) => {
    if (item === null) {
      logger.info(
        "[insured.controller.js] Couldn't find user with query: " +
          JSON.stringify(partnerId)
      );
    } else {
      logger.info(
        '[insured.controller.js] Successfully found ' + JSON.stringify(item)
      );
    }
    return item;
  });
}

/**
 *
 *
 * @param {*} id
 * @param {*} insuredPerson
 * @returns insured
 */
async function updateByInsuredId(id, insuredPerson) {
  const collection = insured();
  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: insuredPerson }
    );
  } catch (err) {
    logger.error(
      '[insured.controller.js] updateByInsuredId (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @param {*} clerkId
 * @returns mongo update object
 */
async function linkClerkByInsuredId(id, clerkId) {
  const collection = insured();

  try {
    const object_id = new mongo.ObjectID(id);
    const object_id_clerkId = new mongo.ObjectID(clerkId);

    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: { clerkId: object_id_clerkId } }
    );
  } catch (err) {
    logger.error(
      '[insured.controller.js] linkClerkByInsuredId (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @param {*} agentId
 * @returns mongo update object
 */
async function linkAgentByInsuredId(id, agentId) {
  const collection = insured();

  try {
    const object_id = new mongo.ObjectID(id);
    const object_id_agentId = new mongo.ObjectID(agentId);

    return await collection.findOneAndUpdate(
      { _id: object_id },
      { $set: { agentId: object_id_agentId } }
    );
  } catch (err) {
    logger.error(
      '[insured.service.js] linkAgentByInsuredId (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} id
 * @returns mongo update object
 */
async function deleteByInsuredId(id) {
  const collection = insured();

  try {
    const object_id = new mongo.ObjectID(id);
    return await collection.deleteOne({ _id: object_id });
  } catch (err) {
    logger.error(
      '[insured.controller.js] deleteByInsuredId (' + id + ') Error: ' + err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} insuredPerson
 * @returns mongo update object
 */
async function createInsured(insuredPerson) {
  const collection = insured();

  if (!!insuredPerson.partnerId) {
    insuredPerson.partnerId = new mongo.ObjectID(insuredPerson.partnerId);
  }
  if (!!insuredPerson.mandantenId) {
    insuredPerson.mandantenId = new mongo.ObjectID(insuredPerson.mandantenId);
  }

  try {
    return await collection.insertOne(insuredPerson);
  } catch (err) {
    logger.error(
      '[insured.service.js] createInsured (' +
        JSON.stringify(insuredPerson) +
        ') Error: ' +
        err
    );
    return false;
  }
}

/**
 *
 *
 * @param {*} search
 * @returns insureds
 */
async function search(search) {
  const collection = insured();

  /*try {
    await collection.createIndex({
      "address.country": "text",
      firstname: "text",
      lastname: "text"
    });
  } catch (err) {
    logger.error("[insured.controller.js] search index problem " + err);
  }*/
  let insuredArray = [];
  try {
    //insuredArray = awai;
    /*t collection
      .aggregate([
        { $match: { $text: { $search: "\"Cathrine\"" } } },
        { $project: { title: 1, _id: 0, score: { $meta: "textScore" } } },
        { $skip: from },
        { $limit: to }
      ])
      .toArray();*/

    insuredArray = await collection
      .aggregate([
        {
          $match: {
            $or: [
              { firstname: { $in: search } },
              {
                lastname: { $in: search },
              },
              {
                'contactData.mail': { $in: search },
              },
              {
                'contactData.telefon': { $in: search },
              },
              {
                'contactData.cellphonenumber': { $in: search },
              },
              {
                'contactData.postOfficeBox': { $in: search },
              },
              {
                'address.streetaddress': { $in: search },
              },
              {
                'address.postcode': { $in: search },
              },
              {
                'address.country': { $in: search },
              },
              {
                'address.state': { $in: search },
              },
            ],
          },
        },
      ])
      .toArray();
  } catch (err) {
    logger.error('[getBySearchTerm] (' + search + '2) ==> ' + err);
  }

  return insuredArray;
}

module.exports = {
  getAll: getAll,
  getById: getById,
  getByInsuredId: getByInsuredId,
  updateByInsuredId: updateByInsuredId,
  linkClerkByInsuredId: linkClerkByInsuredId,
  linkAgentByInsuredId: linkAgentByInsuredId,
  deleteByInsuredId: deleteByInsuredId,
  createInsured: createInsured,
  getByPartnerId: getByPartnerId,
  search: search,
};
