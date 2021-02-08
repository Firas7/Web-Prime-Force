const getService = require('../../database-service/get-claim-case.service');
const service = require('../../database-service/claim-case.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');
const token = require('../../controller/token');
const contractService = require('../../database-service/contract.service');
const insuredService = require('../../database-service/insure.service');
const formService = require('../../database-service/forms.service');
const mail = require('../../controller/mail.controller');
const claimController = require('../../controller/claim.controller');

async function verifyClaimCaseExistedWithSecretCheck(request) {
  // Find an entry from the database that
  const claimCase = await getService.getClaimCaseWithSecret(
    request.params.secret
  );
  if (claimCase != null) {
    return request.payload;
  }
  return Boom.badRequest('CLAIM_CASE_NOT_IN_DATABASE_OR_SECRET_FALSE');
}

async function verifyClaimCaseExistedWithAuth(request) {
  // Find an entry from the database that
  const claimCase = await getService.getClaimCase(request.params.id);
  const loggedUser = request.auth.credentials;
  return claimController.checkAuthForGet(loggedUser, claimCase);
}

async function updateClaimCase(request) {
  return await service.updateById(request.payload, request.params.id);
}

async function addRatingHandler(request) {
  return await service.addRating(request.payload, request.params.id);
}

async function addSchadenssummeHandler(request) {
  return await service.addSchadenssumme(request.payload, request.params.id);
}

async function postNewClaimcase(request) {
  logger.debug(
    'routes/claim/handler.js NewClaim(' + JSON.stringify(request.payload) + ')'
  );
  const claimToken = await token.createClaimToken();
  const contract = await contractService.getContractByID(
    request.payload.contractID
  );
  const insured = await insuredService.getById(contract.partnerId);
  let claimcase = request.payload;
  let auth = {
    branch: claimcase.branch,
    level: 1,
  };
  claimcase['auth'] = auth;
  const resp = await service.postNewClaimcase(
    claimcase,
    claimToken,
    contract.partnerId
  );
  if (request.payload.sendMail) {
    await mail.sendClaimMail(
      insured.contactData.mail,
      claimToken,
      resp.insertedId
    );
  }
  return resp.insertedId;
}

async function updateClaimCaseStatusById(request) {
  logger.debug(
    'routes/claim/handler.js updateClaimCaseStatusById(' +
      Date.now() +
      ' - ID: ' +
      request.params.id +
      ', Status: ' +
      request.params.status +
      ')'
  );
  return await service.updateClaimCaseStatusById(
    request.params.id,
    request.params.status
  );
}

async function updateClaimCaseBySecret(request, res) {
  const claim = request.payload;
  const secret = request.params.secret;

  const dbClaim = await getService.getClaimCaseBySecret(secret);

  if (!dbClaim) {
    logger.error(
      'updateClaimCaseBySecret() cant update claim that doesnt exist'
    );
    return Boom.badRequest("Claim doesn't exist");
  }

  if (dbClaim.status !== 'NONE') {
    return Boom.badRequest("Can't update an already submitted claim.");
  }

  const form = await formService.getFormByVersion(claim.branch, claim.version);

  await claimController.validateClaim(claim, form);

  let result = await service.updateClaimCaseBySecret(claim);
  if (result) {
    const response = {
      statusCode: 200,
      message: 'Success!',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Could not update claim.');
  }
}
module.exports = {
  verifyClaimCaseExistedWithSecretCheck: verifyClaimCaseExistedWithSecretCheck,
  updateClaimCase: updateClaimCase,
  postNewClaimcase: postNewClaimcase,
  addRatingHandler: addRatingHandler,
  addSchadenssummeHandler: addSchadenssummeHandler,
  updateClaimCaseStatusById: updateClaimCaseStatusById,
  updateClaimCaseBySecret: updateClaimCaseBySecret,
  verifyClaimCaseExistedWithAuth: verifyClaimCaseExistedWithAuth,
};
