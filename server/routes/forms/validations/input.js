'use strict';
const Joi = require('@hapi/joi');

const formSchema = Joi.object({
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
          nr: Joi.number().required(),
          id: Joi.number().required(),
          type: Joi.string().required(),
          enableWhen: Joi.object(),
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
  .label('formSchema')
  .description('Forms');

const createFormSchema = Joi.object({
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
          nr: Joi.number().required(),
          id: Joi.number().required(),
          type: Joi.string().required(),
          enableWhen: Joi.object(),
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
  .label('create formSchema')
  .description('Neues Formular anlegen');

const claimSchema = Joi.object({
  _id: Joi.string(),
  branch: Joi.string().required(),
  version: Joi.string().required(),
  answers: Joi.array().items(
    Joi.object().keys({
      id: Joi.number().required(),
      value: Joi.any(),
    })
  ),
  images: Joi.array(),
  status: Joi.string(),
  partnerId: Joi.string(),
  contractId: Joi.string(),
  secret: Joi.string(),
  history: Joi.object().keys({
    creationDate: Joi.date(),
    lastModified: Joi.date(),
  }),
})
  .label('create claimSchema')
  .description('Neuen Claim anlegen');

module.exports = {
  formSchema: formSchema,
  createFormSchema: createFormSchema,
  claimSchema: claimSchema,
};
