const handler = require('./handler');
const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'GET',
    path: '/api/insured',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'insured'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getAllInsuredOutputPayload,
        },
      },
      description: 'Get all insured',
      validate: inputValidations.getAllInsuredInputPayload,
    },
    handler: handler.getAllHandler,
  },
  {
    method: 'POST',
    path: '/api/insured/link',
    config: {
      auth: {
        strategy: 'jwt',
      },
      tags: ['api', 'insured'],
      description: 'Initialise Link between User and Insured',
      validate: {
        payload: inputValidations.linkUserInsuredInputPayload,
      },
    },
    handler: handler.linkUserInsuredHandler,
  },
  {
    method: 'POST',
    path: '/api/insured/link/confirm',
    config: {
      auth: {
        strategy: 'jwt',
      },
      tags: ['api', 'insured'],
      description: 'Confirm Link between User and Insured',
      validate: {
        payload: inputValidations.confirmLinkInsuredInputPayload,
      },
    },
    handler: handler.confirmLinkInsuredHandler,
  },
  {
    method: 'POST',
    path: '/api/insured/{id}/linkClerk',
    config: {
      auth: {
        strategy: 'jwt',
      },
      tags: ['api', 'insured'],
      description: 'Initialise Link between Clerk and Insured',
      validate: {
        payload: inputValidations.linkClerkInsuredInputPayload,
      },
    },
    handler: handler.linkClerkInsuredHandler,
  },
  {
    method: 'POST',
    path: '/api/insured/{id}/linkAgent',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'insured'],
      description: 'Initialise Link between Insured and Agent',
      validate: {
        payload: inputValidations.linkInsuredAgentInputPayload,
      },
    },
    handler: handler.linkInsuredAgentHandler,
  },
  {
    method: 'GET',
    path: '/api/insured/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'insured'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getInsuredOutputPayload,
        },
      },
      description: 'Get an insured by InsuredId',
    },
    handler: handler.getByInsuredIdHandler,
  },
  {
    method: 'GET',
    path: '/api/insured/pid/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'insured'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getInsuredOutputPayload,
        },
      },
      description: 'Get an insured by partnerId',
    },
    handler: handler.getUserByPartnerIdHandler,
  },
  {
    method: 'GET',
    path: '/api/insured/pidInUser/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['INSURED'],
      },
      tags: ['api', 'insured'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getInsuredOutputPayload,
        },
      },
      description: 'Get an insured by partnerId',
    },
    handler: handler.getByPartnerIdHandler,
  },
  {
    method: 'POST',
    path: '/api/insured',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'insured'],
      description: 'Create an insured.',
      validate: {
        payload: inputValidations.insuredInputPayload,
      },
    },
    handler: handler.createInsuredHandler,
  },
  {
    method: 'DELETE',
    path: '/api/insured/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'insured'],
      description: 'Delete an insured',
    },
    handler: handler.deleteInsuredHandler,
  },
  {
    method: 'PUT',
    path: '/api/insured/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'insured'],
      description: 'Update an insured',
      validate: {
        payload: inputValidations.insuredInputPayload,
      },
    },
    handler: handler.updateInsuredHandler,
  },
  {
    method: 'PUT',
    path: '/api/insured/update',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['INSURED'],
      },
      tags: ['api', 'insured'],
      description: 'Update data from linked insured by user',
      validate: {
        payload: inputValidations.insuredUpdateByUserInput,
      },
    },
    handler: handler.updateInsuredByUserHandler,
  },
];
