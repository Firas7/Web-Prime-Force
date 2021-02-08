const handler = require('./handler');
const inputValidations = require('./validations/input');
//const outputValidations = require("./validations/output");

module.exports = [
  {
    method: 'PUT',
    path: '/api/profile/{id}',
    config: {
      auth: {
        strategy: 'jwt',
      },
      validate: {
        payload: inputValidations.profileSchema,
      },
      tags: ['api', 'profile'],
    },
    handler: handler.updateProfileHandler,
  },
  {
    // TODO FRAGE
    method: 'DELETE',
    path: '/api/profile/{id}',
    config: {
      auth: {
        strategy: 'jwt',
      },
    },
    handler: handler.deleteProfileHandler,
  },
  {
    method: 'GET',
    path: '/api/profile/{id}',
    config: {
      auth: {
        strategy: 'jwt',
      },
      tags: ['api', 'profile'],
    },
    handler: handler.getProfileHandler,
  },
  {
    method: 'GET',
    path: '/api/profile/pid/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
      },
      tags: ['api', 'profile'],
    },
    handler: handler.getProfileByPartnerIdHandler,
  },
];
