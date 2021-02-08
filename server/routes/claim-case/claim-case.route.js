const handler = require('./handler');
const getHandler = require('./get-handler');
const imageHandler = require('./image-handler');
const inputValidations = require('./validations/input');
const claimCaseValidations = require('../forms/validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'PUT',
    path: '/api/claim/case/uploadImage/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'claim-case'],
      //pre: [{ method: handler.verifyClaimCaseExistedWithAuth }],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      payload: {
        maxBytes: 209715200,
        output: 'stream',
        allow: 'multipart/form-data',
        multipart: true,
      },
      description: 'Upload an image to an claim case',
    },
    handler: imageHandler.uploadImage,
  },
  {
    method: 'GET',
    path: '/api/claim/case/getImage/{id}/{imageid}',
    config: {
      auth: false,
      tags: ['api', 'claim-case'],
      //pre: [{ method: handler.verifyClaimCaseExistedWithAuth }],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'get an image from an claim case',
    },
    handler: imageHandler.getImage,
  },
  {
    method: 'DELETE',
    path: '/api/claim/case/deleteImage/{id}',
    config: {
      auth: false,
      tags: ['api', 'claim-case'],
      //pre: [{ method: handler.verifyClaimCaseExistedWithAuth }],
      validate: {
        payload: inputValidations.deleteImageinput,
      },
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'delete an image from an claim case',
    },
    handler: imageHandler.deleteImage,
  },
  {
    method: 'PUT',
    path: '/api/claim/case/uploadImage/{id}/{secret}',
    config: {
      auth: false,
      tags: ['api', 'claim-case'],
      validate: {
        payload: inputValidations.stream,
      },
      //pre: [{ method: handler.verifyClaimCaseExistedWithSecretCheck }],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      payload: {
        maxBytes: 209715200,
        output: 'stream',
        allow: 'multipart/form-data',
        multipart: true,
      },
      description: 'Upload an image to an claim case with secret',
    },
    handler: imageHandler.uploadImage,
  },
  {
    method: 'PUT',
    path: '/api/claim/case/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      validate: {
        payload: inputValidations.claimcaseModel,
      },
      tags: ['api', 'claim-case'],
      pre: [{ method: handler.verifyClaimCaseExistedWithAuth }],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'Update Claim-Case',
    },
    handler: handler.updateClaimCase,
  },
  {
    method: 'PUT',
    path: '/api/claim/case/{id}/{secret}',
    config: {
      auth: false,
      validate: {
        payload: inputValidations.claimcaseModel,
      },
      tags: ['api', 'claim-case'],
      pre: [{ method: handler.verifyClaimCaseExistedWithSecretCheck }],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'Update Claim-Case With secret',
    },
    handler: handler.updateClaimCase,
  },
  {
    method: 'PUT',
    path: '/api/claim/case/rating/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['INSURED'],
      },
      validate: {
        payload: inputValidations.ratingModel,
      },
      tags: ['api', 'claim-case'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'Add Rating to claimcase',
    },
    handler: handler.addRatingHandler,
  },
  {
    method: 'PUT',
    path: '/api/claim/case/schadenssumme/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['api', 'claim-case'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'Add Schadenssumme to claimcase',
    },
    handler: handler.addSchadenssummeHandler,
  },
  {
    method: 'GET',
    path: '/api/claim/case/{id}/{secret}',
    config: {
      auth: false,
      tags: ['api', 'claim-case'],
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      description: 'Get Claim-Case with id and secret',
    },
    handler: getHandler.getWithSecret,
  },
  {
    method: 'GET',
    path: '/api/claim/cases',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'claim-case'],
      plugins: {
        'hapi-swagger': {
          response: outputValidations.getAllClaimcasePayload,
        },
      },
      description: 'Get all claimcases',
    },
    handler: getHandler.getClaimcases,
  },
  {
    method: 'GET',
    path: '/api/claim/cases/count/state',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'claim-case'],
      plugins: {
        'hapi-swagger': {
          response: outputValidations.getAllClaimcasePayload,
        },
      },
      description: 'Get all claimcases',
    },
    handler: getHandler.getClaimcasesCountByState,
  },
  {
    method: 'GET',
    path: '/api/claim/cases/count/create',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'claim-case'],
      plugins: {
        'hapi-swagger': {
          response: outputValidations.getAllClaimcasePayload,
        },
      },
      description: 'Get all claimcases',
    },
    handler: getHandler.getClaimcasesCountByCreate,
  },
  {
    method: 'GET',
    path: '/api/claim/case/{partnerId}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'claim-case'],
      description: 'Get claimcases by partnerId',
    },
    handler: getHandler.getByPartnerId,
  },
  {
    method: 'GET',
    path: '/api/claim/{secret}',
    config: {
      auth: false,
      /* Auskommentiert da Claim get ohne Account
      auth: { 
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },*/
      tags: ['api', 'claim-case'],
      description: 'Get claimcases by secret',
    },
    handler: getHandler.getClaimCaseBySecret,
  },
  {
    method: 'GET',
    path: '/api/claim/case/id/{id}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['api', 'claim-case'],
      description: 'Get claimcases by id',
    },
    handler: getHandler.getClaimCaseById,
  },
  {
    method: 'PUT',
    path: '/api/claim/{secret}',
    config: {
      auth: false,
      /* Auskommentiert da Claim get ohne Account
      auth: { 
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },*/
      tags: ['api', 'claim-case'],
      pre: [{ method: handler.verifyClaimCaseExistedWithSecretCheck }],
      description: 'Update Claim Case by secret',
      validate: {
        payload: claimCaseValidations.claimSchema,
      },
    },
    handler: handler.updateClaimCaseBySecret,
  },
  {
    method: 'POST',
    path: '/api/claim/case',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN', 'INSURED', 'CLERK', 'AGENT'],
      },
      tags: ['claim-case', 'api'],
      description: 'Create new claimcase **DEPRECATED**',
      validate: {
        //payload: inputValidations.claimcaseModel
      },
    },
    handler: handler.postNewClaimcase,
  },
  {
    method: 'PUT',
    path: '/api/claimcase/changestatus/{id}/{status}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      tags: ['claim-case', 'api'],
      description: 'Change status of claimcase',
      plugins: {
        'hapi-swagger': {
          responses: outputValidations.standart,
        },
      },
      validate: {
        params: inputValidations.updateClaimCaseStatusParams,
      },
    },
    handler: handler.updateClaimCaseStatusById,
  },
];
