'use strict';
const Joi = require('@hapi/joi');

const stream = Joi.object({
  file: Joi.any().required(),
})
  .required()
  .label('Upload single file')
  .description('FORM DATA KEY:file TYPE:FILE');

const claimcaseModel = Joi.object()
  .keys({
    status: Joi.string(),
    date: Joi.string(),
    case: Joi.any(),
  })
  .label('Claim-Case');

const deleteImageinput = Joi.object().keys({
  small: Joi.string().required(),
  sd: Joi.string().required(),
  hd: Joi.string().required(),
  fullHd: Joi.string().required(),
});

const updateClaimCaseStatusParams = Joi.object({
  id: Joi.string().required(),
  status: Joi.string()
    .valid(
      'RECEIVED',
      'PROCESS',
      'REQUIRED',
      'DENIED',
      'CONFIRMED',
      'DISBURSED',
      'SUCCESS',
      'NONE',
      'PENDING',
      'PROGRESS',
      'FINISHED',
      'DECLINED'
    )
    .required(), // TODO: Use enum
});

const ratingModel = Joi.object()
  .keys({
    stars: Joi.number().required(),
    comment: Joi.string(),
  })
  .label('Rating model');

module.exports = {
  stream: stream,
  // createClaimCaseKFZ: createClaimCaseKFZ,
  // updateClaimCaseKFZ: updateClaimCaseKFZ,
  deleteImageinput: deleteImageinput,
  updateClaimCaseStatusParams: updateClaimCaseStatusParams,
  claimcaseModel: claimcaseModel,
  ratingModel: ratingModel,
};
