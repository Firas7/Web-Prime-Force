const service = require('../../database-service/insure.service');
const clerkService = require('../../database-service/clerk.service');
const agentService = require('../../database-service/agent.service');
const logger = require('../../logger');
const createLinkUserInsuredToken = require('../../controller/token')
  .createLinkUserInsuredToken;
const Boom = require('@hapi/boom');
const userService = require('../../database-service/user.service');
const mail = require('../../controller/mail.controller');

async function getAllHandler(req) {
  let beginAtIndex = 0;
  let limit = 100;

  if (req.query != null) {
    if (req.query.beginAtIndex != null) {
      beginAtIndex = req.query.beginAtIndex;
    }
    if (req.query.limit != null) {
      limit = req.query.limit;
    }
  }
  logger.debug(
    '[insured.controller.js] getAllHandler(' + beginAtIndex + ',' + limit + ')'
  );

  return await service.getAll(beginAtIndex, limit);
}

async function linkUserInsuredHandler(req, res) {
  const userId = req.auth.credentials.id;
  const partnerId = req.payload.partnerId;
  const insuredObject = await getByPartnerId(partnerId);
  if (!insuredObject) {
    return Boom.badRequest('Partnerid not found');
  }
  const token = await createLinkUserInsuredToken();
  let sucessfullySaved = await userService.updateLinkUserInsuredToken(
    userId,
    token,
    partnerId
  );
  if (!sucessfullySaved) {
    return Boom.badRequest('Could not save Confirmation-Token');
  }
  let mailSend = await mail.sendTokenToLinkUserInsured(
    insuredObject.firstname + ' ' + insuredObject.lastname,
    insuredObject.contactData.mail,
    token
  );
  if (mailSend) {
    logger.info(
      'Sent email with Confirmation-Token to ' + insuredObject.contactData.mail
    );
  } else {
    logger.error('Couldnt sent email to ' + insuredObject.contactData.mail);
    return Boom.conflict('Couldnt send email');
  }

  const response = res.response(
    'Successfully sent email with Confirmation-Token'
  );
  response.type('text/plain');
  response.code(200);
  return response;
}

async function confirmLinkInsuredHandler(req, res) {
  const userId = req.auth.credentials.id;
  const email = req.auth.credentials.email;
  const token = req.payload.linkToken;
  const user = await userService.getUser(email);
  if (user == null) {
    return Boom.badRequest('User not found');
  }
  const savedToken = user.token.linkUserInsuredToken;
  const savedTokenExpiryDate = user.token.linkTokenExpiryDate;
  if (savedTokenExpiryDate < Date.now()) {
    return Boom.badRequest('Confirmation-Token expired');
  }
  if (savedToken == token) {
    let successfullySaved = await userService.confirmLinkUserInsuredToken(
      userId,
      token
    );
    if (!successfullySaved) {
      return Boom.conflict('Couldnt save confirmation of linking');
    }
    let response = res.response('Successfully linked User with PartnerID');
    response.type('text/plain');
    response.code(200);
    return response;
  } else {
    return Boom.badRequest('This Confirmation-Token is not valid');
  }
}

async function linkClerkInsuredHandler(req, res) {
  // const insuredObject = await getByInsuredIdHandler(req.params.id);
  const clerkId = req.payload.clerkId;
  const clerkObject = await clerkService.getById(clerkId);
  if (!clerkObject) {
    return Boom.badRequest('ClerkId not found');
  }

  let linkStatus = await service.linkClerkByInsuredId(req.params.id, clerkId);

  if (
    linkStatus &&
    linkStatus.lastErrorObject.n &&
    linkStatus.lastErrorObject.updatedExisting
  ) {
    const response = {
      statusCode: 200,
      message: 'Success! Linked a clerkId to insured.',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to linked a clerkId to insured.');
  }
}

async function linkInsuredAgentHandler(req, res) {
  // const insuredObject = await getByInsuredIdHandler(req.params.id);
  const agentId = req.payload.agentId;
  const agentObject = await agentService.getById(agentId);
  if (!agentObject) {
    return Boom.badRequest('AgentId not found');
  }

  let linkStatus = await service.linkAgentByInsuredId(req.params.id, agentId);

  if (
    linkStatus &&
    linkStatus.lastErrorObject.n &&
    linkStatus.lastErrorObject.updatedExisting
  ) {
    const response = {
      statusCode: 200,
      message: 'Success! Linked a agentId to insured.',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to linked a agentId to insured.');
  }
}

async function getByInsuredIdHandler(req) {
  let insured = await service.getByInsuredId(req.params.id);

  if (insured) {
    return insured;
  } else {
    return Boom.badRequest('Insured not found.');
  }
}

async function getByPartnerId(partnerId) {
  let insured = await service.getByPartnerId(partnerId);

  if (insured) {
    return insured;
  } else {
    return Boom.badRequest('Insured not found.');
  }
}

async function getByPartnerIdHandler(req) {
  let user = await userService.getUser(req.auth.credentials.email);

  if (user.linkedPartner && !user.linkedPartner.confirmed) {
    return Boom.unauthorized('Partnerid is not linked to user');
  }
  if (user.linkedPartner.partnerId != req.params.partnerId) {
    return Boom.unauthorized(
      'You can only update the Insured-Object which is linked to your user account!'
    );
  }

  let insured = await service.getByPartnerId(req.params.partnerId);

  if (insured) {
    return insured;
  } else {
    return Boom.badRequest('Insured not found.');
  }
}

async function getUserByPartnerIdHandler(req) {
  let user = await service.getByPartnerId(req.params.partnerId);

  if (user) {
    return user;
  } else {
    return Boom.badRequest('User not found.');
  }
}

async function createInsuredHandler(req, res) {
  let createStatus = await service.createInsured(req.payload);

  if (createStatus && createStatus.result.ok && createStatus.result.n) {
    const response = {
      statusCode: 201,
      message: 'Success! Created Insured with id: ' + createStatus.insertedId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create insured.');
  }
}

async function updateInsuredHandler(req, res) {
  let updateStatus = await service.updateByInsuredId(
    req.params.id,
    req.payload
  );

  if (
    updateStatus &&
    updateStatus.lastErrorObject.n &&
    updateStatus.lastErrorObject.updatedExisting
  ) {
    const response = {
      statusCode: 200,
      message: 'Success! Updated an insured user.',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to update insured.');
  }
}

async function deleteInsuredHandler(req, res) {
  let deleteStatus = await service.deleteByInsuredId(req.params.id);

  if (deleteStatus && deleteStatus.result.ok && deleteStatus.result.n) {
    const response = {
      statusCode: 200,
      message: 'Success! Deleted an insured user',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to delete insured.');
  }
}

async function updateInsuredByUserHandler(req, res) {
  let user = await userService.getUser(req.auth.credentials.email);

  if (user.linkedPartner && !user.linkedPartner.confirmed) {
    return Boom.unauthorized('There is no linked Partnerid for this user!');
  }

  const insuredObject = await getByPartnerId(user.linkedPartner.partnerId);

  if (!insuredObject) {
    return Boom.notFound('Insured not found!');
  }

  let updateStatus = await service.updateByInsuredId(
    insuredObject._id,
    req.payload
  );

  if (
    updateStatus &&
    updateStatus.lastErrorObject.n &&
    updateStatus.lastErrorObject.updatedExisting
  ) {
    const response = {
      statusCode: 200,
      message: 'Successfully updated insured data!',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to update insured data!');
  }
}

module.exports = {
  getAllHandler: getAllHandler,
  getByPartnerIdHandler: getByPartnerIdHandler,
  getUserByPartnerIdHandler: getUserByPartnerIdHandler,
  linkUserInsuredHandler: linkUserInsuredHandler,
  confirmLinkInsuredHandler: confirmLinkInsuredHandler,
  linkClerkInsuredHandler: linkClerkInsuredHandler,
  linkInsuredAgentHandler: linkInsuredAgentHandler,
  getByInsuredIdHandler: getByInsuredIdHandler,
  createInsuredHandler: createInsuredHandler,
  deleteInsuredHandler: deleteInsuredHandler,
  updateInsuredHandler: updateInsuredHandler,
  updateInsuredByUserHandler: updateInsuredByUserHandler,
};
