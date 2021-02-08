'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const getContractModel = Joi.object()
  .keys({
    insurancepapernumber: Joi.string().required(),
    _id: Joi.string(),
    branch: Joi.string(),
    productname: Joi.string(),
    startdate: Joi.date(),
    partnerId: Joi.string().required(),
  })
  .label('getInsured result');
const getContractArrayModel = Joi.array().items(getContractModel);
const getContracts = {
  '200': {
    description: 'Success',
    schema: getContractArrayModel,
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

const putContractToInsured = {
  '200': {
    description: 'Success',
    schema: Joi.any(),
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
  getContracts: getContracts,
  putContractToInsured: putContractToInsured,
};
