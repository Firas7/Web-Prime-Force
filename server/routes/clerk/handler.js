const service = require('../../database-service/clerk.service');
const insuredService = require('../../database-service/insure.service');
const userService = require('../../database-service/user.service');
// const logger = require('../../logger');
const Boom = require('@hapi/boom');

async function getByPartnerIdHandler(req) {
  const partnerId = req.params.partnerId;

  const user = await userService.getUser(req.auth.credentials.email);
  if (user.linkedPartner && !user.linkedPartner.confirmed) {
    return Boom.unauthorized('Partnerid is not linked to user');
  }
  if (user.linkedPartner.partnerId != partnerId) {
    return Boom.unauthorized(
      'You can only get the Insured-Object which is linked to your user account!'
    );
  }

  const insuredObject = await insuredService.getByPartnerId(partnerId);
  if (!insuredObject) {
    return Boom.badRequest('Insured related to this partnerId not found.');
  }

  const clerkId = insuredObject.clerkId;
  const clerkObject = await service.getById(clerkId);
  if (clerkObject) {
    return clerkObject;
  } else {
    return Boom.badRequest('Clerk not found.');
  }
}

module.exports = {
  getByPartnerIdHandler: getByPartnerIdHandler,
};
