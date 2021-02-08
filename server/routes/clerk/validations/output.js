'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const getClerkOutputPayloadModel = Joi.object()
  .keys({
    name: Joi.string(),
    insurance: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    faceImage: Joi.string(),
  })
  .label('getByPartnerId result');

const getClerkOutputPayload = {
  '200': {
    description: 'Success',
    schema: getClerkOutputPayloadModel,
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
  getClerkOutputPayload: getClerkOutputPayload,
};
