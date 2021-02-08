const service = require('../../database-service/profile.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');

async function updateProfileHandler(req) {
  logger.debug('updateProfileHandler(' + req + ')');
  return await service.updatetProfileById(req.payload, req.params.id);
}

async function deleteProfileHandler(req) {
  return Boom.badRequest('Not yet implementet (' + req.params.id + ')');
  /*
  logger.debug("deleteProfile handler(" + id + ")");
  return await service.deleteTenantById(id);*/
}

async function getProfileHandler(req) {
  logger.debug('getProfileHandler(' + req.params.id + ')');
  return await service.getProfileById(req.params.id);
}

async function getProfileByPartnerIdHandler(req) {
  logger.debug('getProfileBPartnerIdHandler(' + req.params.partnerId + ')');
  return await service.getProfileByPartnerId(req.params.partnerId);
}

module.exports = {
  updateProfileHandler: updateProfileHandler,
  deleteProfileHandler: deleteProfileHandler,
  getProfileHandler: getProfileHandler,
  getProfileByPartnerIdHandler: getProfileByPartnerIdHandler,
};
