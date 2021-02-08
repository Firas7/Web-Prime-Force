'use strict';
const Joi = require('@hapi/joi');

const insuredInputPayload = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  faceImage: Joi.string(),
})
  .label('agentInputPayload')
  .description('Agent data model.');

module.exports = {
  insuredInputPayload: insuredInputPayload,
};
