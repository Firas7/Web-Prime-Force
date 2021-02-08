'use strict';
const Joi = require('@hapi/joi');
//const HeadersPayLoad = require('../../../schema/validation').HeadersPayLoad;

const contractSchema = Joi.object({
  _id: Joi.string(),
  insurancepapernumber: Joi.string().required(),
  branch: Joi.string(),
  productname: Joi.string(),
  startdate: Joi.date(),
  partnerId: Joi.string().required(),
})
  .label('ContractInputPayload')
  .description('Contract data model');

const getAllContractInputPayload = {
  //headers: HeadersPayLoad.optionalKeys('Authorization').required(),
  query: Joi.object({ beginAtIndex: Joi.number(), limit: Joi.number() }),
};

const createContractSchema = Joi.object({
  insurancepapernumber: Joi.string().required(),
  branch: Joi.string(),
  productname: Joi.string(),
  startdate: Joi.date(),
  partnerId: Joi.string().required(),
  auth: Joi.object({
    branch: Joi.string().required(),
    level: Joi.number().required(),
  }).optional(),
})
  .label('CreatContractInputPayload')
  .description('Add a new contract');

const linkInsuredToContract = Joi.object({
  partnerId: Joi.string().required(),
  contractId: Joi.string().required(),
})
  .label('linkInsuredToContract')
  .description('add insured (partnerId) to contract');

module.exports = {
  contractSchema: contractSchema,
  createContractSchema: createContractSchema,
  linkInsuredToContract: linkInsuredToContract,
  getAllContractInputPayload: getAllContractInputPayload,
};
