'use strict';
const Joi = require('@hapi/joi');

const tenantSchema = Joi.object({
  _id: Joi.string(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  url: Joi.string(),
  pathname: Joi.string(),
})
  .label('TenantSchema')
  .description('tenant data model');

module.exports = { tenantSchema };
