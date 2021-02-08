'use strict';
const service = require('../../database-service/user.service');
const Boom = require('@hapi/boom');
const userController = require('../../controller/user.controller');
const logger = require('../../logger');
const createToken = require('../../controller/token').createToken;
const registerToken = require('../../controller/token').createRegisterToken;
const resetToken = require('../../controller/token').createResetToken;
const mail = require('../../controller/mail.controller');

function userLoginHandler(req, res) {
  // If the user's password is correct, we can issue a token.
  // If it was incorrect, the error will bubble up from the pre method
  let response = {};
  if (req.query != null && req.query.app != null) {
    response = res.response({ id_token: createToken(req.pre.user, true) });
  } else {
    response = res.response({ id_token: createToken(req.pre.user, false) });
  }

  response.type('text/plain');
  response.code(201);
  return response;
}

async function userCreateHandler(req, res) {
  let user = {};
  const payload = req.payload;
  user.email = payload.email.toLowerCase();
  user.valid = false;
  user.coredata = {};

  user.coredata.firstname = payload.firstname;
  user.coredata.lastname = payload.lastname;
  user.scope = ['INSURED'];
  user.password = userController.hashPassword(payload.password);
  user.token = {};
  user.token.registerToken = registerToken(payload.email);
  if (user.password == null) {
    return Boom.badRequest('Hash funktion broken');
  }
  if (user.token.registerToken == null) {
    return Boom.badRequest('Hash funktion broken for registerToken');
  }
  if (
    await mail.sendRegister(
      user.firstname + ' ' + user.lastname,
      user.email,
      user.token.registerToken
    )
  ) {
    logger.error('Mail sending failed for: ' + user.email);
  }
  if (service.createUser(user)) {
    // If the user is saved successfully, issue a JWT
    const token = createToken(user, false);
    if (token == null) {
      return Boom.badRequest('token funktion broken');
    }
    logger.info('new token for: ' + user.email + ' token: ' + token);
    const response = res.response(token);
    response.type('text/plain');
    response.code(201);

    return response;
  } else {
    return Boom.badRequest('User creation failed');
  }
}

async function completeRegHandler(request, res) {
  if (request.query == null || request.query.token == null) {
    return Boom.badRequest('Incorrect Query Params!');
  }
  const token = request.query.token;

  let user = await service.getUserByRegToken(token);
  if (user == null) {
    return Boom.badRequest('user not found!');
  }
  if (user.token.registerToken === null) {
    return Boom.badRequest('User has no registerToken!');
  }
  if (token === user.token.registerToken) {
    if (await service.completeRegById(user._id)) {
      user.valid = true;
      const token = createToken(user, false);
      if (token == null) {
        return Boom.badRequest('token funktion broken');
      }
      logger.info('new token for: ' + user.email + ' token: ' + token);
      const response = res.response(token);
      response.type('text/plain');
      response.code(201);
      return response;
    } else {
      return Boom.badRequest('Error in Update function!');
    }
  } else {
    return Boom.badRequest('Incorrect Token!');
  }
}

async function recoverPasswordHandler(request, res) {
  const email = request.payload.email.toLowerCase();
  let user = await service.getUser(email);
  let token = await resetToken();

  if (!user) return Boom.badRequest('Email not found.');

  await service.updateResetToken(user._id, token);
  logger.info(
    'new password reset token for: ' + user.email + ' token: ' + token
  );

  let link = process.env.URI + '/password-forget/' + token;

  if (
    !(await mail.sendReset(
      user.coredata.firstname + ' ' + user.coredata.lastname,
      user.email,
      link
    ))
  ) {
    logger.info('sent rest email to: ' + user.email + ' with link: ' + link);

    const response = res.response(token);

    response.type('text/plain');
    response.code(200);
    return response;
  } else {
    return Boom.badRequest('Something went wrong.');
  }
}

async function resetPasswordHandler(request, res) {
  let user = await service.getUserByResetToken(
    request.payload.resetPasswordToken
  );

  if (!user) return Boom.badRequest('Token is not valid.');

  if (Date.now() > user.token.passwordResetExpiryDate)
    return Boom.badRequest('Token is not valid anymore.');

  let passwordHash = userController.hashPassword(request.payload.password);

  if (await service.updateUserPassword(user._id, passwordHash)) {
    if (
      !(await mail.sendSuccess(
        user.coredata.firstname + ' ' + user.coredata.lastname,
        user.email
      ))
    ) {
      logger.info('Sent success email to ' + user._id);
    }

    const response = res.response('Successfully updated the password.');

    response.type('text/plain');
    response.code(200);
    return response;
  } else {
    return Boom.badRequest('Failed to update password');
  }
}

async function adminUserCreateHandler(req, res) {
  let user = {};
  const payload = req.payload;
  user.email = payload.email.toLowerCase();
  user.valid = false;
  user.coredata = {};

  user.coredata.firstname = payload.firstname;
  user.coredata.lastname = payload.lastname;
  user.scope = payload.scope;

  if (!!payload.auth) {
    user.auth = payload.auth;
  }

  let randomPassword = userController.generateRandomPassword();
  user.password = userController.hashPassword(randomPassword);

  user.token = {};
  user.token.registerToken = registerToken(user.email);

  if (
    await mail.sendRegisterWithPW(
      user.firstname + ' ' + user.lastname,
      user.email,
      user.token.registerToken,
      randomPassword
    )
  ) {
    if (service.createUser(user)) {
      logger.info('Successfully created new User with email: ' + user.email);
      const response = res.response(true);
      response.type('text/plain');
      response.code(201);
      return response;
    } else {
      return Boom.badRequest('User creation failed');
    }
  } else {
    logger.error('Mail sending failed for: ' + user.email);
    return Boom.badRequest("Couldn't sent E-Mail");
  }
}

async function initialPasswordChangeHandler(req, res) {
  const payload = req.payload;
  const registerToken = payload.registerToken;
  let user = await service.getUserByRegToken(registerToken);
  if (user == null) {
    return Boom.badRequest('Bad register token!');
  }

  let credentials = {};
  credentials.payload = {};
  credentials.payload.email = user.email;
  credentials.payload.password = payload.token;

  // Check old pw / token
  if (Boom.isBoom(await userController.verifyCredentials(credentials))) {
    return Boom.badRequest('Authentication failed!');
  } else {
    // Change pw
    let passwordHash = userController.hashPassword(payload.newPassword);
    if (!(await service.updateUserPassword(user._id, passwordHash))) {
      return Boom.badRequest('Failed to update password!');
    }
    // Complete registration (set User valid and delete registerToken)
    if (await service.completeRegById(user._id)) {
      logger.info('User validation successfull');
    } else {
      logger.error('Error at user validation');
    }
    // Generate and return jwt-Token
    let loginReq = { pre: { user: user }, query: req.query };
    return userLoginHandler(loginReq, res);
  }
}

module.exports = {
  resetPasswordHandler: resetPasswordHandler,
  recoverPasswordHandler: recoverPasswordHandler,
  completeRegHandler: completeRegHandler,
  userCreateHandler: userCreateHandler,
  userLoginHandler: userLoginHandler,
  adminUserCreateHandler: adminUserCreateHandler,
  initialPasswordChangeHandler: initialPasswordChangeHandler,
};
