const handler = require('./handler');
const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'GET',
    path: '/api/agent/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'agent'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getAgentOutputPayload,
        },
      },
      description: 'Get an agent by partnerId',
    },
    handler: handler.getAgentByPartnerIdHandler,
  },
  {
    method: 'POST',
    path: '/api/agent',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'agent'],
      description: 'Create an agent.',
      validate: {
        payload: inputValidations.agentInputPayload,
      },
    },
    handler: handler.createAgentHandler,
  },
];
