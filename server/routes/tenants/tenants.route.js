const handler = require('./handler');
const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'PUT',
    path: '/api/tenants/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'tenant'],
      plugins: {
        'hapi-swagger': {
          //responses: outputValidations.getTenants,
        },
      },
      description: 'Update a tenant',
      validate: {
        payload: inputValidations.tenantSchema,
      },
    },
    handler: handler.updateTenantHandler,
  },
  {
    method: 'DELETE',
    path: '/api/tenants/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'tenant'],
      plugins: {
        'hapi-swagger': {
          //responses: outputValidations.getTenants,
        },
      },
      description: 'Delete a tenant',
    },
    handler: handler.deleteTenantHandler,
  },
  {
    method: 'GET',
    path: '/api/tenants',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'tenant'],
      plugins: {
        'hapi-swagger': {
          response: outputValidations.getTenants,
        },
      },
      description: 'Get all tenants',
    },
    handler: handler.getAllHandler,
  },
  {
    method: 'POST',
    path: '/api/tenants',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'tenant'],
      plugins: {
        'hapi-swagger': {
          //responses: outputValidations.getTenants,
        },
      },
      description: 'Add new tenant',
      validate: {
        payload: inputValidations.tenantSchema,
      },
    },
    handler: handler.createTenantHandler,
  },
];
