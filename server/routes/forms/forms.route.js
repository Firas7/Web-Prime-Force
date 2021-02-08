const handler = require('./handler');
const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'GET',
    path: '/api/form',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'form'],
      plugins: {
        'hapi-swagger': {
          response: outputValidations.formPayloadModel,
        },
      },
      description: 'Get all forms',
    },
    handler: handler.getAllForms,
  },
  {
    method: 'POST',
    path: '/api/form',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['form', 'api'],
      description: 'Post new form',
      validate: {
        payload: inputValidations.createFormSchema,
      },
    },
    handler: handler.postNewForm,
  },
  {
    method: 'GET',
    path: '/api/form/{branch}/{version}',
    config: {
      auth: false,
      /* Auskommentiert da Claim get ohne Account
      auth: { 
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },*/
      tags: ['api', 'form'],
      plugins: {
        'hapi-swagger': {
          response: outputValidations.formPayloadModel,
        },
      },
      description: 'Get branch by name and version',
    },
    handler: handler.getFormByVersion,
  },
  {
    method: 'PUT',
    path: '/api/form/{branch}/{version}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['form', 'api'],
      validate: {
        payload: inputValidations.formSchema,
      },
      description: 'Update form by name and version',
    },
    handler: handler.updateForm,
  },
  {
    method: 'POST',
    path: '/api/form/{branch}/{version}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['form', 'api'],
      validate: {
        payload: inputValidations.claimSchema,
      },
      description: 'Create new claim for specified form',
    },
    handler: handler.createClaim,
  },
  {
    method: 'POST',
    path: '/api/form/admin/{branch}/{version}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'CLERK', 'AGENT'],
      },
      tags: ['form', 'api'],
      validate: {
        payload: inputValidations.claimSchema,
      },
      description: 'Create new claim for specified form',
    },
    handler: handler.createClaimAdmin,
  },
];
