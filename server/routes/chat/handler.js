const service = require('../../database-service/chat.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');

async function getAllChats(request) {
  logger.debug(`routes/chat/handler.js getAllChats(${request})`);
  return await service.getAllChats(request);
}
async function getByUserId(request) {
  logger.debug(
    `routes/claim/handler.js getByUserId (${request.params.userId})`
  );
  return await service.getByUserId(request.params.userId);
}

async function getByChatId(request) {
  logger.debug(
    `routes/claim/handler.js getByChatId (${request.params.chatId})`
  );
  return await service.getByChatId(request.params.chatId);
}

async function getByBusinessObjectId(request) {
  logger.debug(
    `routes/claim/handler.js getByBusinessObjectId (${request.params.boId})`
  );
  return await service.getByBusinessObjectId(request.params.boId);
}

async function postChat(req, res) {
  let createStatus = await service.createChat(
    JSON.parse(JSON.stringify(req.payload))
  );

  if (createStatus && createStatus.result.ok && createStatus.result.n) {
    const response = {
      statusCode: 201,
      message: 'Success! Created chat with id: ' + createStatus.insertedId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create chat.');
  }
}

async function postMessageToChat(request) {
  return await service.createMessage(request.params.chatId, request.payload);
}

module.exports = {
  getAllChats: getAllChats,
  getByUserId: getByUserId,
  getByChatId: getByChatId,
  getByBusinessObjectId: getByBusinessObjectId,
  postChat: postChat,
  postMessageToChat: postMessageToChat,
};
