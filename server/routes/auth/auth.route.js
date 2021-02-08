'use strict';
const handler = require('./handler');
const userController = require('../../controller/user.controller');
const inputValidations = require('./validations/input');
const outputValidations = require('./validations/output');

module.exports = [
  {
    method: 'POST',
    path: '/api/users/register',
    config: {
      tags: ['api', 'user'],
      auth: false,
      // Before the route handler runs, verify that the user is unique
      pre: [{ method: userController.verifyUniqueUser }],
      validate: {
        payload: inputValidations.userSchema,
      },
    },
    handler: handler.userCreateHandler,
  },
  {
    method: 'POST',
    path: '/api/users/authenticate',
    config: {
      tags: ['api', 'user'],
      // Check the user's password against the DB
      auth: false,
      pre: [{ method: userController.verifyCredentials, assign: 'user' }],
      validate: {
        payload: inputValidations.authenticateUserSchema,
      },
    },
    handler: handler.userLoginHandler,
  },
  {
    method: 'PUT',
    path: '/api/users/authenticate/validMail',
    config: {
      tags: ['api', 'user'],
      auth: false,
      //validate: {
      //query: { token: Joi.string().required() },
      // },
    },
    handler: handler.completeRegHandler,
  },
  {
    method: 'POST',
    path: '/api/users/recover',
    config: {
      tags: ['api', 'user'],
      auth: false,
      validate: {
        payload: inputValidations.recoverPasswordSchema,
      },
    },
    handler: handler.recoverPasswordHandler,
  },
  {
    method: 'POST',
    path: '/api/users/reset',
    config: {
      tags: ['api', 'user'],
      auth: false,
      validate: {
        payload: inputValidations.resetPasswordSchema,
      },
    },
    handler: handler.resetPasswordHandler,
  },
  {
    method: 'POST',
    path: '/api/users/regByAdmin',
    config: {
      tags: ['api', 'user'],
      auth: {
        strategy: 'jwt',
        scope: ['ADMIN'],
      },
      pre: [{ method: userController.verifyUniqueUser }],
      validate: {
        payload: inputValidations.adminUserRegisterSchema,
      },
      plugins: {
        'hapi-swagger': {
          response: outputValidations.standard,
        },
      },
      handler: handler.adminUserCreateHandler,
    },
  },
  {
    method: 'POST',
    path: '/api/users/register/setPassword',
    config: {
      tags: ['api', 'user'],
      auth: false,
      validate: {
        payload: inputValidations.initialPasswordChangeSchema,
      },
      plugins: {
        'hapi-swagger': {
          response: outputValidations.standard,
        },
      },
    },
    handler: handler.initialPasswordChangeHandler,
  },
];
