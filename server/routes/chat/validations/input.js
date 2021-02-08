'use strict';
const Joi = require('@hapi/joi');
//const HeadersPayLoad = require('../../../schema/validation').HeadersPayLoad;

const chatSchema = Joi.object().keys({
  id: Joi.string().required(),
  participants: Joi.array().items(Joi.string().required()),
  timestamp: Joi.any().required(),
  businessObjectID: Joi.string(),
  category: Joi.string().required(),
  active: Joi.bool().required(),
  messages: Joi.array().items(
    Joi.object().keys({
      messageID: Joi.string().required(),
      author: Joi.string().required(),
      timestamp: Joi.string().required(),
      content: Joi.string().required(),
    })
  ),
});

module.exports = {
  chatSchema: chatSchema,
};
