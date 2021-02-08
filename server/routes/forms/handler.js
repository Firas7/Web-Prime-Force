const service = require('../../database-service/forms.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');
const token = require('../../controller/token');
const claimController = require('../../controller/claim.controller');
const mail = require('../../controller/mail.controller');
const insuredService = require('../../database-service/insure.service');

async function getFormByVersion(request) {
  logger.debug(
    'routes/form/handler.js getFormByVersion(' +
      request.params.branch +
      ' ' +
      request.params.version +
      ' )'
  );
  return await service.getFormByVersion(
    request.params.branch,
    request.params.version
  );
}

async function getAllForms() {
  logger.debug('routes/form/handler.js getAllForms()');
  return await service.getAllForms();
}

async function postNewForm(request) {
  logger.debug(
    'routes/form/handler.js postNewForm(' +
      request.payload.branch +
      ' ' +
      request.payload.version +
      ' )'
  );
  return await service.postNewForm(request.payload);
}

async function updateForm(request) {
  logger.debug(
    'routes/form/handler.js updateForm(' +
      request.params.branch +
      ' ' +
      request.params.version +
      ' )'
  );
  return await service.updateForm(
    request.params.branch,
    request.params.version,
    request.payload
  );
}

async function createClaim(request, res) {
  logger.debug('routes/forms/handler.js createClaim(' + request.payload + ')');
  const claim = request.payload;
  const form = await service.getFormByVersion(claim.branch, claim.version);

  if (!form) {
    return Boom.badRequest('No matching form found.');
  }

  await claimController.validateClaim(claim, form);

  const claimToken = await token.createClaimToken();
  const insert = await service.postNewClaim(request.payload, claimToken);

  if (insert) {
    const response = {
      statusCode: 201,
      message: 'Success!',
      id: insert.insertedId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create claim.');
  }
}

async function createClaimAdmin(request, res) {
  logger.debug(
    'routes/forms/handler.js createClaimAsAdmin(' +
      JSON.stringify(request.payload) +
      ')'
  );
  const claim = request.payload;
  const form = await service.getFormByVersion(claim.branch, claim.version);

  if (!form) {
    return Boom.badRequest('No matching form found.');
  }

  await claimController.validateClaim(claim, form);

  const claimToken = await token.createClaimToken();
  const insert = await service.postNewClaim(request.payload, claimToken);
  const insured = await insuredService.getById(request.payload.partnerId);

  if (insert) {
    await mail.sendClaimMail(
      insured.firstname,
      insured.contactData.mail,
      claimToken,
      insert.insertedId
    );
    const response = {
      statusCode: 201,
      message: 'Success!',
      id: insert.insertedId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create claim.');
  }
}

module.exports = {
  getFormByVersion: getFormByVersion,
  getAllForms: getAllForms,
  postNewForm: postNewForm,
  updateForm: updateForm,
  createClaim: createClaim,
  createClaimAdmin: createClaimAdmin,
};
