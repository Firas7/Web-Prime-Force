const handler = require('./handler');
// const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'GET',
    path: '/api/clerk/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'clerk'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getClerkOutoutPayload,
        },
      },
      description: 'Get an clerk by partnerId',
    },
    handler: handler.getByPartnerIdHandler,
  },
];
