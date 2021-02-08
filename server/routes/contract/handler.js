const service = require('../../database-service/contract.service');
const insuredService = require('../../database-service/insure.service');
const userService = require('../../database-service/user.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');
const userController = require('../../controller/user.controller');

async function updateContractByIdHandler(req, res) {
  const insuredObject = await insuredService.getByPartnerId(
    req.payload.partnerId
  );

  if (!insuredObject) {
    return Boom.notFound('Insured not found!');
  }

  delete req.payload._id;
  let updateStatus = await service.updateByContractId(
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
      message: 'Successfully updated contract data!',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to update contract data!');
  }
}

async function deleteContractHandler(req, res) {
  let deleteStatus = await service.deleteByContractId(req.params.id);

  if (deleteStatus && deleteStatus.result.ok && deleteStatus.result.n) {
    const response = {
      statusCode: 200,
      message: 'Success! Deleted a contract',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to delete contract');
  }
}

async function getAllHandler(req, res) {
  let beginAtIndex = 0;
  let limit = 50;
  const loggedUser = req.auth.credentials;

  if (req.query != null) {
    if (req.query.beginAtIndex != null) {
      beginAtIndex = req.query.beginAtIndex;
    }
    if (req.query.limit != null) {
      limit = req.query.limit;
    }
  }

  if (loggedUser.scope.includes('ADMIN')) {
    logger.debug(
      '[contract.service.js] getAllHandler AS ADMIN (' +
        beginAtIndex +
        ',' +
        limit +
        ')'
    );
    let response = {
      contracts: await service.getAll(beginAtIndex, limit),
      documents: await service.getNumberOfDocuments(),
      statusCode: 200,
      message:
        'Success! Fetched contracts between index: ' +
        beginAtIndex +
        ' and ' +
        beginAtIndex +
        limit,
    };
    return res.response(response).code(200);
  }
  if (
    loggedUser.scope.includes('CLERK') ||
    loggedUser.scope.includes('AGENT')
  ) {
    logger.debug(
      '[contract.service.js] getAllHandler AS CLERK OR AGENT (' +
        beginAtIndex +
        ',' +
        limit +
        ')'
    );
    let auth = await userController.checkUserObjectAuth(loggedUser);
    if (auth == null) {
      return Boom.badRequest(loggedUser.scope + ' ARE NOT IN A AUTH GROUP');
    }
    let con = await service.getAllAuth(beginAtIndex, limit, auth);
    let count = await service.getAllAuthCount(auth);
    if (count.length == 0 || count[0].n == null) {
      count = 0;
    } else {
      count = count[0].n;
    }
    let response = {
      contracts: con,
      documents: count,
      statusCode: 200,
      message:
        'Success! Fetched contracts between index: ' +
        beginAtIndex +
        ' and ' +
        beginAtIndex +
        limit,
    };
    return res.response(response).code(200);
  }

  return Boom.badRequest('Scope not found');
}

async function createContractHandler(req, res) {
  const insuredObject = await insuredService.getByPartnerId(
    req.payload.partnerId
  );

  if (!insuredObject) {
    return Boom.notFound('Insured not found!');
  }
  let contract = req.payload;
  let auth = {
    branch: contract.branch,
    level: 1,
  };
  contract['auth'] = auth;
  let createStatus = await service.createByContractId(req.payload);

  if (createStatus && createStatus.result.ok && createStatus.result.n) {
    const response = {
      statusCode: 201,
      message: 'Success! Created contract with id: ' + createStatus.insertedId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create contract.');
  }
}

async function getUserContractsHandler(req) {
  let user = await userService.getUser(req.auth.credentials.email);

  if (user.linkedPartner && !user.linkedPartner.confirmed) {
    return Boom.unauthorized('Partnerid is not linked to user');
  }
  if (user.linkedPartner.partnerId != req.params.partnerId) {
    return Boom.unauthorized(
      'You can only get the Contract-Objects which are linked to your user account!'
    );
  }

  let contracts = await service.getByPartnerId(req.params.partnerId);

  if (contracts) {
    return contracts;
  } else {
    return Boom.badRequest('No Contracts found.');
  }
}

async function getByPartnerIdHandler(req) {
  let contract = await service.getByPartnerId(req.params.partnerId);

  if (contract) {
    return contract;
  } else {
    return Boom.badRequest('Contract not found.');
  }
}

async function getByContractIdHandler(req) {
  let contract = await service.getByContractId(req.params.id);

  if (contract) {
    return contract;
  } else {
    return Boom.badRequest('Contract not found.');
  }
}

module.exports = {
  updateContractByIdHandler: updateContractByIdHandler,
  deleteContractHandler: deleteContractHandler,
  getAllHandler: getAllHandler,
  createContractHandler: createContractHandler,
  getUserContractsHandler: getUserContractsHandler,
  getByPartnerIdHandler: getByPartnerIdHandler,
  getByContractIdHandler: getByContractIdHandler,
};
