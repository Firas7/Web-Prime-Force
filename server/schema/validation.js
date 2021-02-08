const Joi = require('@hapi/joi');
const nameRegex = /^[A-Za-z\u00c0-\u00d6\u00d9-\u00f6\u00f9-\u01bf \-]+$/;
function schemaForStatusCode(statusCode) {
  let schema = {
    errors: {},
  };

  schema.errors[statusCode] = Joi.array().items(Joi.string());

  return Joi.object().keys(schema);
}

// --------------------------------------------------
//    Schemas
// --------------------------------------------------

const HeadersPayLoad = Joi.object()
  .keys({
    Authorization: Joi.string()
      .required()
      .description('A valid Json Web Token'),
  })
  .unknown()
  .rename('authorization', 'Authorization');

const errorModel = Joi.object({
  code: Joi.number(),
  msg: Joi.string(),
}).label('Error');

const NotFoundStatus = {
  status: {
    404: schemaForStatusCode(404),
  },
};

const BadRequestStatus = {
  status: {
    400: schemaForStatusCode(400),
  },
};

const UnauthorizedStatus = {
  status: {
    401: schemaForStatusCode(401),
  },
};

const ForbiddenStatus = {
  status: {
    403: schemaForStatusCode(403),
  },
};

const ErrorsOutputValidations = {
  sample: 50,
  status: {
    500: schemaForStatusCode(500),
  },
};

module.exports = {
  BadRequestStatus,
  ForbiddenStatus,
  NotFoundStatus,
  UnauthorizedStatus,
  schemaForStatusCode,
  ErrorsOutputValidations,
  HeadersPayLoad,
  errorModel,
  nameRegex,
};
