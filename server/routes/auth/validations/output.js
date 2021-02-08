'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const standard = {
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
  standard: standard,
};
