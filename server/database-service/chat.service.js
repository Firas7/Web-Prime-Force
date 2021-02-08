'use strict';
const logger = require('../logger');
const chats = require('./collection-service').chats;
const mongo = require('mongodb');
/** @module service/chat */

/**
 *
 *
 * @param {*} chatID
 * @returns chat
 */
async function getByChatId(chatID) {
  const collection = chats();
  const object_id = new mongo.ObjectID(chatID);
  try {
    return await collection.find({ _id: object_id }).toArray();
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @returns chats
 */
async function getAllChats() {
  const collection = chats();
  try {
    return await collection.find().toArray();
  } catch (err) {
    logger.error(err);
    return false;
  }
}

async function getByUserId(userID) {
  const collection = chats();
  // const object_id = new mongo.ObjectID(chatID);
  try {
    return await collection.find({ participants_id: userID }).toArray();
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} boID
 * @returns chats
 */
async function getByBusinessObjectId(boID) {
  const collection = chats();
  // const object_id = new mongo.ObjectID(chatID);
  try {
    return await collection.find({ businessObjectID: boID }).toArray();
  } catch (err) {
    logger.error(err);
    return false;
  }
}

/**
 *
 *
 * @param {*} chat
 * @returns mongo create object
 */
async function createChat(chat) {
  const collection = chats();
  chat._id = new mongo.ObjectID(chat._id);
  try {
    return await collection.insertOne(chat);
  } catch (err) {
    logger.error(
      '[chat.service] createChat (' + JSON.stringify(chat) + ') Error: ' + err
    );
    return false;
  }
}

async function createMessage(chatID, message) {
  const collection = chats();
  message['timestamp'] = new Date().toISOString();
  try {
    const object_id = new mongo.ObjectID(chatID);
    message['_id'] = new mongo.ObjectID();
    await collection.findOneAndUpdate(
      { _id: object_id },
      { $push: { messages: message } }
    );
    return true;
  } catch (err) {
    logger.error(
      '[chat.service] createMessage (' +
        chatID +
        JSON.stringify(message) +
        ') Error: ' +
        err
    );
    return false;
  }
}

module.exports = {
  getAllChats: getAllChats,
  getByBusinessObjectId: getByBusinessObjectId,
  getByChatId: getByChatId,
  getByUserId: getByUserId,
  createChat: createChat,
  createMessage: createMessage,
};
