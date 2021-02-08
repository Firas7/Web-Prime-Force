'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const getTenantModel = Joi.object()
  .keys({
    _id: Joi.string(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    url: Joi.string(),
    pathname: Joi.string(),
  })
  .label('getTenants result');

const getTenantArrayModel = Joi.array().items(getTenantModel);
const getTenants = {
  '200': {
    description: 'Success',
    schema: getTenantArrayModel,
  },
  '400': {
    description: 'Bad Request',
    schema: errorModel,
  },
  '500': {
    description: 'Internal Server Error',
    schema: errorModel,
  },
};

module.exports = {
  getTenants: getTenants,
};
