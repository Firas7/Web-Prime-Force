'use strict';

const Joi = require('@hapi/joi');
const errorModel = require('../../../schema/validation').errorModel;

const getAllInsuredOutputPayloadModel = Joi.array()
  .items(
    Joi.object().keys({
      salutation: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      gender: Joi.number(),
      birthday: Joi.date(),
      address: Joi.object().keys({
        streetaddress: Joi.string(),
        housenumber: Joi.string(),
        postcode: Joi.number(),
        country: Joi.string(),
        state: Joi.string(),
        city: Joi.string(),
      }),
      contactData: Joi.object().keys({
        postOfficeBox: Joi.string(),
        mail: Joi.string(),
        telefon: Joi.number(),
        cellphonenumber: Joi.string(),
      }),
      partnerId: Joi.any(),
      mandantenGruppenListen: Joi.array().items(
        Joi.object().keys({
          mandantenId: Joi.any(),
          acronym: Joi.string(),
          desiggnation: Joi.string(),
        })
      ),
    })
  )
  .label('Result');

const getInsuredOutputPayloadModel = Joi.object()
  .keys({
    salutation: Joi.string(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    gender: Joi.number(),
    birthday: Joi.date(),
    address: Joi.object().keys({
      streetaddress: Joi.string(),
      housenumber: Joi.string(),
      postcode: Joi.string(),
      country: Joi.string(),
      state: Joi.string(),
      city: Joi.string(),
    }),
    contactData: Joi.object().keys({
      postOfficeBox: Joi.string(),
      mail: Joi.string(),
      telefon: Joi.string(),
      cellphonenumber: Joi.string(),
    }),
    partnerId: Joi.string(),
    mandantenId: Joi.string(),
  })
  .label('getInsured result');

const getAllInsuredOutputPayload = {
  '200': {
    description: 'Success',
    schema: getAllInsuredOutputPayloadModel,
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

const getInsuredOutputPayload = {
  '200': {
    description: 'Success',
    schema: getInsuredOutputPayloadModel,
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
  getAllInsuredOutputPayload: getAllInsuredOutputPayload,
  getInsuredOutputPayload: getInsuredOutputPayload,
};
