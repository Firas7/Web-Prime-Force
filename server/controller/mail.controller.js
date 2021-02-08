'use strict';
const Wreck = require('@hapi/wreck');
const safeMail = require('../database-service/mail.service').safeMail;
const mailUri = require('../config/server.config').MAIL_SERVER;
const logger = require('../logger');

/** @module controller/mail */

const wreck = Wreck.defaults({
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 *
 *
 * @param {*} token
 * @returns link
 */
function genRegLink(token) {
  return process.env.URI + '/reg-complete?token=' + token;
}

/**
 *
 *
 * @param {*} token
 * @param {*} id
 * @returns link
 */
function genClaimLink(token, id) {
  //return process.env.URI + '/claim/claimcase?id=' + id + '&token=' + token;
  logger.debug('genClaimLink(' + id + ',' + token + ')');
  return process.env.URI + '/self-claim/' + token;
}

/**
 *
 *
 * @param {*} token
 * @returns link
 */
function genRegLinkWithOTPW(token) {
  return process.env.URI + '/set-password?token=' + token;
}

/**
 *
 *
 * @param {*} username
 * @param {*} email
 * @param {*} link
 * @returns boolean
 */
async function sendRegister(username, email, link) {
  const generatedLink = genRegLink(link);
  const data = { username: username, email: email, link: generatedLink };

  try {
    const { res, payload } = await wreck.post(mailUri + '/api/mail/register', {
      payload: data,
    });
    if (await safeMail(data, res, payload, true)) {
      return res.status === 200;
    } else {
      return false;
    }
  } catch (err) {
    await safeMail(data, err, {}, false);
    return false;
  }
}

/**
 *
 *
 * @param {*} username
 * @param {*} email
 * @param {*} link
 * @returns boolean
 */
async function sendReset(username, email, link) {
  const data = { username: username, email: email, link: link };

  try {
    const { res, payload } = await wreck.post(mailUri + '/api/mail/reset', {
      payload: data,
    });
    if (await safeMail(data, res, payload, true)) {
      return res.status === 200;
    } else {
      return false;
    }
  } catch (err) {
    await safeMail(data, err, {}, false);
    return false;
  }
}

async function sendSuccess(username, email) {
  const data = { username: username, email: email };

  try {
    const { res, payload } = await wreck.post(mailUri + '/api/mail/success', {
      payload: data,
    });
    if (await safeMail(data, res, payload, true)) {
      return res.status === 200;
    } else {
      return false;
    }
  } catch (err) {
    await safeMail(data, err, {}, false);
    return false;
  }
}

/**
 *
 *
 * @param {*} username
 * @param {*} email
 * @param {*} token
 * @returns boolean
 */
async function sendTokenToLinkUserInsured(username, email, token) {
  const data = { username: username, email: email, token: token };

  try {
    const { res, payload } = await wreck.post(
      mailUri + '/api/mail/linkUserInsured',
      { payload: data }
    );
    if (await safeMail(data, res, payload, true)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    await safeMail(data, err, {}, false);
    return false;
  }
}

/**
 *
 *
 * @param {*} name
 * @param {*} email
 * @param {*} token
 * @param {*} id
 * @returns boolean
 */
async function sendClaimMail(name, email, token, id) {
  let link = genClaimLink(token, id);
  const data = { email: email, link: link, name: name };
  try {
    const { res, payload } = await wreck.post(mailUri + '/api/mail/claim', {
      payload: data,
    });
    if (await safeMail(data, res, payload, true)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    await safeMail(data, err, {}, false);
    return false;
  }
}

async function sendRegisterWithPW(
  username,
  email,
  registerToken,
  oneTimePassword
) {
  const generatedLink = genRegLinkWithOTPW(registerToken);
  const data = {
    username: username,
    email: email,
    link: generatedLink,
    otpw: oneTimePassword,
  };

  try {
    const { res, payload } = await wreck.post(
      mailUri + '/api/mail/registerByAdmin',
      {
        payload: data,
      }
    );
    if (await safeMail(data, res, payload, true)) {
      return res.statusCode === 200;
    } else {
      return false;
    }
  } catch (err) {
    await safeMail(data, err, {}, false);
    return false;
  }
}

module.exports = {
  sendRegister: sendRegister,
  sendReset: sendReset,
  sendSuccess: sendSuccess,
  sendTokenToLinkUserInsured: sendTokenToLinkUserInsured,
  sendClaimMail: sendClaimMail,
  sendRegisterWithPW: sendRegisterWithPW,
};
