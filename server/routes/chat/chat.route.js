const handler = require('./handler');
const inputValidations = require('./validations/input');
//const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'GET',
    path: '/api/chat',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'chat'],
      description: 'Get all chats ',
    },
    handler: handler.getAllChats,
  },
  {
    method: 'GET',
    path: '/api/chat/uid/{userId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'chat'],
      description: 'Get chats by userId',
    },
    handler: handler.getByUserId,
  },
  {
    method: 'GET',
    path: '/api/chat/bo/{boId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'chat'],
      description: 'Get chats by businessObjectId',
    },
    handler: handler.getByBusinessObjectId,
  },
  {
    method: 'GET',
    path: '/api/chat/{chatId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'chat'],
      description: 'Get chats by chatId',
    },
    handler: handler.getByChatId,
  },
  {
    method: 'POST',
    path: '/api/chat',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      validate: {
        payload: inputValidations.chatSchema,
      },
      tags: ['api', 'chat'],
    },
    handler: handler.postChat,
  },
  {
    method: 'PUT',
    path: '/api/chat/{chatId}/message',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED'],
      },
      tags: ['api', 'chat'],
    },
    handler: handler.postMessageToChat,
  },
];
