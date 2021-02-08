'use strict';

const Joi = require('@hapi/joi');
const nameRegex = require('../../../schema/validation').nameRegex;

const userSchema = Joi.object({
  firstname: Joi.string().min(2).max(30).regex(nameRegex).required(),
  lastname: Joi.string().min(2).max(30).regex(nameRegex).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
  .label('userSchema')
  .description('Regestrieren');

const profileSchema = Joi.object({
  _id: Joi.string().required(),
  firstname: Joi.string().alphanum().min(2).max(30).regex(nameRegex).required(),
  lastname: Joi.string().alphanum().min(2).max(30).regex(nameRegex).required(),
  email: Joi.string().email().required(),
})
  .label('profileSchema')
  .description('Updates für Profil');

module.exports = {
  userSchema: userSchema,
  profileSchema: profileSchema,
};
