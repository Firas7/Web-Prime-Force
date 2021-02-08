'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const getAgentOutputPayloadModel = Joi.object()
  .keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    faceImage: Joi.string(),
  })
  .label('getByPartnerId result');

const getAgentOutputPayload = {
  '200': {
    description: 'Success',
    schema: getAgentOutputPayloadModel,
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
  getAgentOutputPayload: getAgentOutputPayload,
};
