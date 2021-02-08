const logger = require('../logger');
const Boom = require('@hapi/boom');
const userController = require('./user.controller');
const userService = require('../database-service/user.service');

/** @module controller/claim */

/**
 *
 *
 * @param {*} claim
 * @param {*} form
 * @returns boolean
 */
async function validateClaim(claim, form) {
  for (const step of form.steps) {
    for (const field of step.fields) {
      if (field.attributes.isRequired && field.type !== 'upload') {
        let answer = claim.answers.find((answer) => answer.id === field.id);

        if (
          !answer ||
          (answer.value === undefined && claim.status !== 'NONE')
        ) {
          logger.error('createClaim() handler: Invalid Payload Input');
          return Boom.badRequest(
            'Invalid payload input. Field id: ' + field.id
          );
        }
      }
    }
  }
}

/**
 *
 *
 * @param {*} user
 * @param {*} claim
 * @returns boolean
 */
async function checkAuth(user, claim) {
  user = await userService.getUser(user.email);
  logger.info(
    'checkAuth user:' +
      JSON.stringify(user) +
      ' claim: ' +
      JSON.stringify(claim)
  );
  if (user == null || claim == null) {
    return false;
  }
  if (user.scope.includes('ADMIN')) {
    return true;
  }
  if (user.scope.includes('INSURED')) {
    let partnerId = await userController.checkUserObjectPartner(user);
    logger.debug('checkAuth user:' + partnerId + ' claim: ' + claim.partnerId);
    if (partnerId == null) {
      return false;
    }
    if (String(partnerId).localeCompare(String(claim.partnerId)) == 0) {
      return true;
    }
    logger.debug('return 3');
    return false;
  }
  if (user.scope.includes('CLERK') || user.scope.includes('AGENT')) {
    if (user.auth == null) {
      return false;
    }
    if (claim.auth == null) {
      return true;
    } else if (
      claim.auth.branch == user.auth.branch &&
      claim.auth.level >= user.auth.level
    ) {
      return true;
    }
  }

  return false;
}
/**
 *
 *
 * @param {*} user
 * @param {*} claim
 * @returns boolean
 */
async function checkAuthForGet(user, claim) {
  const result = await checkAuth(user, claim);
  if (result == true) {
    return claim;
  } else {
    return Boom.badRequest('CLAIM NOT FOUND OR USER HAS NOT THE RIGHTS');
  }
}

module.exports = {
  checkAuthForGet: checkAuthForGet,
  checkAuth: checkAuth,
  validateClaim: validateClaim,
};
