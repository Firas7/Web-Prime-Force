const Boom = require('@hapi/boom');
const agentService = require('../../database-service/agent.service');
const insuredService = require('../../database-service/insure.service');
const userService = require('../../database-service/user.service');

async function getAgentByPartnerIdHandler(req) {
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

  const agentId = insuredObject.agentId;
  const agentObject = await agentService.getById(agentId);
  if (agentObject) {
    return agentObject;
  } else {
    return Boom.badRequest('Agent not found.');
  }
}

async function createAgentHandler(req, res) {
  let createStatus = await agentService.createAgent(req.payload);

  if (createStatus && createStatus.result.ok && createStatus.result.n) {
    const response = {
      statusCode: 201,
      message: 'Success! Created agent with id: ' + createStatus.agentId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create agent.');
  }
}

module.exports = {
  getAgentByPartnerIdHandler: getAgentByPartnerIdHandler,
  createAgentHandler: createAgentHandler,
};
