'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const standart = {
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
/*
const claimcaseImageDeletePayloadModel = Joi.array().items(
  Joi.object().keys({
    small: Joi.string(),
    sd: Joi.string(),
    hd: Joi.string(),
    fullHd: Joi.string()
  })
);
*/
module.exports = {
  standart: standart,
  //claimcaseImageDeletePayloadModel: claimcaseImageDeletePayloadModel
};
