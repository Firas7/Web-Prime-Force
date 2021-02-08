const handler = require('./handler');
const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'PUT',
    path: '/api/contracts/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      validate: {
        payload: inputValidations.contractSchema,
      },
      tags: ['api', 'contracts'],
    },
    handler: handler.updateContractByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/api/contracts/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'contracts'],
    },
    handler: handler.deleteContractHandler,
  },
  {
    method: 'GET',
    path: '/api/contracts',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'contracts'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getContracts,
        },
      },
      description: 'Get all contracts',
      validate: inputValidations.getAllContractInputPayload,
    },
    handler: handler.getAllHandler,
  },
  {
    method: 'POST',
    path: '/api/contracts',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      validate: {
        payload: inputValidations.createContractSchema,
      },
      tags: ['api', 'contracts'],
    },
    handler: handler.createContractHandler,
  },
  {
    method: 'GET',
    path: '/api/contracts/admin/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'contracts'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getContracts,
        },
      },
      description: 'Get all contracts by a specific partnerId (insured)',
    },
    handler: handler.getByPartnerIdHandler,
  },
  {
    method: 'GET',
    path: '/api/contracts/user/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['INSURED'],
      },
      tags: ['api', 'contracts'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getContracts,
        },
      },
      description: 'Get all contracts of a user by partnerId (insured)',
    },
    handler: handler.getUserContractsHandler,
  },
  {
    method: 'GET',
    path: '/api/contracts/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'contracts'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.getContracts,
        },
      },
      description: 'Get contracts by contractId',
    },
    handler: handler.getByContractIdHandler,
  },
];
