const service = require('../../database-service/get-claim-case.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');
const userController = require('../../controller/user.controller');
const claimController = require('../../controller/claim.controller');

async function getClaimcases(request) {
  const loggedUser = request.auth.credentials;

  if (loggedUser.scope.includes('ADMIN')) {
    logger.info('GET CLAIM CASES BY ADMIN');
    return await service.getAllClaimcases();
  }
  if (loggedUser.scope.includes('INSURED')) {
    logger.info('GET CLAIM CASES BY INSURED');
    logger.info(JSON.stringify(loggedUser));
    let partnerId = await userController.checkUserObjectPartner(loggedUser);
    if (partnerId == null) {
      return Boom.badRequest('Partner id null or not valid');
    }
    return await service.getByPartnerId(partnerId);
  }
  if (
    loggedUser.scope.includes('CLERK') ||
    loggedUser.scope.includes('AGENT')
  ) {
    logger.info('GET CLAIM CASES BY CLERK OR AGENT');
    let auth = await userController.checkUserObjectAuth(loggedUser);
    if (auth == null) {
      return Boom.badRequest(loggedUser.scope + ' ARE NOT IN A AUTH GROUP');
    }
    return await service.getClaimCasesForAuth(auth);
  }

  return Boom.badRequest('Scope not found');
}

async function getClaimcasesCountByCreate(request) {
  const loggedUser = request.auth.credentials;
  if (loggedUser.scope.includes('ADMIN')) {
    logger.info('GET CLAIM CASES BY ADMIN');
    return await service.countPerCreateAll();
  }
  if (loggedUser.scope.includes('INSURED')) {
    logger.info('GET CLAIM CASES BY INSURED');
    let partnerId = await userController.checkUserObjectPartner(loggedUser);
    if (partnerId == null) {
      return Boom.badRequest('Partner id null or not valid');
    }
    return await service.countPerCreateUser(partnerId);
  }
  if (
    loggedUser.scope.includes('CLERK') ||
    loggedUser.scope.includes('AGENT')
  ) {
    logger.info('GET CLAIM CASES BY CLERK OR AGENT');
    let auth = await userController.checkUserObjectAuth(loggedUser);
    if (auth == null) {
      return Boom.badRequest(loggedUser.scope + ' ARE NOT IN A AUTH GROUP');
    }
    return await service.countPerCreateAuth(auth);
  }

  return Boom.badRequest('Scope not found');
}

function groupByState(counts) {
  let ob = {};
  for (let index = 0; index < counts.length; index++) {
    const element = counts[index];
    ob[element._id] = element.count;
  }
  return ob;
}
async function getClaimcasesCountByState(request) {
  const loggedUser = request.auth.credentials;
  if (loggedUser.scope.includes('ADMIN')) {
    logger.info('GET CLAIM CASES BY ADMIN');
    return groupByState(await service.countPerStateAll());
  }
  if (loggedUser.scope.includes('INSURED')) {
    logger.info('GET CLAIM CASES BY INSURED');
    let partnerId = await userController.checkUserObjectPartner(loggedUser);
    if (partnerId == null) {
      return Boom.badRequest('Partner id null or not valid');
    }
    return groupByState(await service.countPerStateUser(partnerId));
  }
  if (
    loggedUser.scope.includes('CLERK') ||
    loggedUser.scope.includes('AGENT')
  ) {
    logger.info('GET CLAIM CASES BY CLERK OR AGENT');
    let auth = await userController.checkUserObjectAuth(loggedUser);
    if (auth == null) {
      return Boom.badRequest(loggedUser.scope + ' ARE NOT IN A AUTH GROUP');
    }
    return await service.countPerStateAuth(auth);
  }

  return Boom.badRequest('Scope not found');
}

async function getByPartnerId(request) {
  return await service.getByPartnerId(request.params.partnerId);
}

async function getWithSecret(request) {
  let result = await service.getClaimCaseWithSecret(
    request.params.id,
    request.params.secret
  );
  const loggedUser = request.auth.credentials;
  return claimController.checkAuthForGet(loggedUser, result);
}

async function getClaimCaseBySecret(request) {
  return await service.getClaimCaseBySecret(request.params.secret);
  //const loggedUser = request.auth.credentials; Auskommentiert weil get With secret for someone without a account
  //return claimController.checkAuthForGet(loggedUser, result);
}

async function getClaimCaseById(request) {
  let result = await service.getClaimCase(request.params.id);
  const loggedUser = request.auth.credentials;
  return claimController.checkAuthForGet(loggedUser, result);
}

module.exports = {
  getByPartnerId: getByPartnerId,
  getWithSecret: getWithSecret,
  getClaimCaseBySecret: getClaimCaseBySecret,
  getClaimCaseById: getClaimCaseById,
  getClaimcases: getClaimcases,
  getClaimcasesCountByState: getClaimcasesCountByState,
  getClaimcasesCountByCreate: getClaimcasesCountByCreate,
};
