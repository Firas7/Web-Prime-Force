'use strict';
const Joi = require('@hapi/joi');

const formPayloadModel = Joi.object()
  .keys({
    _id: Joi.string(),
    branch: Joi.string().required(),
    info: Joi.string(),
    version: Joi.string().required(),
    active: Joi.boolean().required(),
    steps: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        step: Joi.number().required(),
        fields: Joi.array().items(
          Joi.object().keys({
            nr: Joi.string().required(),
            id: Joi.string().required(),
            type: Joi.string().required(),
            enableWhen: Joi.string(),
            attributes: Joi.object()
              .keys({
                label: Joi.string().required(),
                isRequired: Joi.boolean().required(),
              })
              .unknown(),
          })
        ),
      })
    ),
  })
  .label('Form payload model');

module.exports = {
  formPayloadModel: formPayloadModel,
};
