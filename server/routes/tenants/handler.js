const service = require('../../database-service/tenant.service');
const logger = require('../../logger');
const Boom = require('@hapi/boom');

async function updateTenantHandler(req, res) {
  const tenantObject = await service.getById(req.params.id);

  if (!tenantObject) {
    return Boom.notFound('Tenant not found!');
  }

  delete req.payload._id;
  let updateStatus = await service.updateById(req.params.id, req.payload);

  if (
    updateStatus &&
    updateStatus.lastErrorObject.n &&
    updateStatus.lastErrorObject.updatedExisting
  ) {
    const response = {
      statusCode: 200,
      message: 'Successfully updated tenant data!',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to update tenant data!');
  }
}

async function deleteTenantHandler(req, res) {
  const tenantObject = await service.getById(req.params.id);

  if (!tenantObject) {
    return Boom.notFound('Tenant not found!');
  }
  let deleteStatus = await service.deleteById(req.params.id);

  if (deleteStatus && deleteStatus.result.ok && deleteStatus.result.n) {
    const response = {
      statusCode: 200,
      message: 'Success! Deleted a tenant',
    };
    return res.response(response).code(200);
  } else {
    return Boom.badRequest('Failed to delete tenant');
  }
}

async function getAllHandler(req, res) {
  let beginAtIndex = 0;
  let limit = 50;

  if (req.query != null) {
    if (req.query.beginAtIndex != null) {
      beginAtIndex = parseInt(req.query.beginAtIndex);
    }
    if (req.query.limit != null) {
      limit = parseInt(req.query.limit);
    }
  }
  logger.debug(
    '[tenant.service.js] getAllHandler (' + beginAtIndex + ',' + limit + ')'
  );

  let response = {
    tenants: await service.getAll(beginAtIndex, Number(limit)),
    documents: await service.getNumberOfDocuments(),
    statusCode: 200,
    message:
      'Success! Fetched tenants between index: ' +
      beginAtIndex +
      ' and ' +
      beginAtIndex +
      limit,
  };
  return res.response(response).code(200);
}

async function createTenantHandler(req, res) {
  let createStatus = await service.createTenant(req.payload);

  if (createStatus && createStatus.result.ok && createStatus.result.n) {
    const response = {
      statusCode: 201,
      message: 'Success! Created tenant with id: ' + createStatus.insertedId,
      insertedId: createStatus.insertedId,
    };
    return res.response(response).code(201);
  } else {
    return Boom.badRequest('Failed to create tenant.');
  }
}

module.exports = {
  createTenantHandler: createTenantHandler,
  updateTenantHandler: updateTenantHandler,
  deleteTenantHandler: deleteTenantHandler,
  getAllHandler: getAllHandler,
};
