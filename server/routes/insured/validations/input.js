'use strict';
const Joi = require('@hapi/joi');
//const HeadersPayLoad = require('../../../schema/validation').HeadersPayLoad;

const linkUserInsuredInputPayload = Joi.object({
  partnerId: Joi.string().required(),
});

const confirmLinkInsuredInputPayload = Joi.object({
  linkToken: Joi.string().required(),
});

const linkClerkInsuredInputPayload = Joi.object({
  clerkId: Joi.string().required(),
});

const linkInsuredAgentInputPayload = Joi.object({
  agentId: Joi.string().required(),
});

const getAllInsuredInputPayload = {
  //headers: HeadersPayLoad.optionalKeys('Authorization').required(),
  query: Joi.object({ beginAtIndex: Joi.number(), limit: Joi.number() }),
};

const insuredInputPayload = Joi.object({
  salutation: Joi.string().allow(''),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  gender: Joi.number().min(0),
  birthday: Joi.date(),
  address: Joi.object().keys({
    streetaddress: Joi.string().allow(''),
    housenumber: Joi.string().allow(''),
    postcode: Joi.string().allow(''),
    country: Joi.string().allow(''),
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
  }),
  contactData: Joi.object().keys({
    postOfficeBox: Joi.string().allow(''),
    mail: Joi.string().allow(''),
    telefon: Joi.string().allow(''),
    cellphonenumber: Joi.string().allow(''),
  }),
  partnerId: Joi.string().allow(''),
  mandantenId: Joi.string().allow(''),
})
  .label('insuredInputPayload')
  .description('Insured data model.');

const insuredUpdateByUserInput = Joi.object({
  salutation: Joi.string().allow(''),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  gender: Joi.number().min(0),
  birthday: Joi.date(),
  address: Joi.object().keys({
    streetaddress: Joi.string().allow(''),
    housenumber: Joi.string().allow(''),
    postcode: Joi.string().allow(''),
    country: Joi.string().allow(''),
    state: Joi.string().allow(''),
    city: Joi.string().allow(''),
  }),
  contactData: Joi.object().keys({
    postOfficeBox: Joi.string().allow(''),
    mail: Joi.string().allow(''),
    telefon: Joi.string().allow(''),
    cellphonenumber: Joi.string().allow(''),
  }),
})
  .label('insuredUpdateByUserInput')
  .description(
    'Insured data model for updating insured data by the linked user'
  );

module.exports = {
  linkUserInsuredInputPayload: linkUserInsuredInputPayload,
  confirmLinkInsuredInputPayload: confirmLinkInsuredInputPayload,
  linkClerkInsuredInputPayload: linkClerkInsuredInputPayload,
  linkInsuredAgentInputPayload: linkInsuredAgentInputPayload,
  getAllInsuredInputPayload: getAllInsuredInputPayload,
  insuredInputPayload: insuredInputPayload,
  insuredUpdateByUserInput: insuredUpdateByUserInput,
};
