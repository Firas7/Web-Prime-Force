'use strict';
const Joi = require('@hapi/joi');

const authenticateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})
  .label('authenticateUserSchema')
  .description('login');

const recoverPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
})
  .label('recoverPasswordSchema')
  .description('Password Recovery');

const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  resetPasswordToken: Joi.string().required(),
})
  .label('resetPasswordSchema')
  .description('Update User password');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
})
  .label('userSchema')
  .description('Sign up new User');

const adminUserRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  scope: Joi.array().items(Joi.string()).required(),
  auth: Joi.object({
    branch: Joi.string().required(),
    level: Joi.number().required(),
  }).optional(),
})
  .label('userSchema for registration by Admin')
  .description('Sign up new User from Admin interface');

const initialPasswordChangeSchema = Joi.object({
  registerToken: Joi.string().required(),
  token: Joi.string().required(),
  newPassword: Joi.string().required(),
})
  .label('initialPasswordChangeSchema')
  .description('Initial password change after Registration by Admin');

module.exports = {
  authenticateUserSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  userSchema,
  adminUserRegisterSchema,
  initialPasswordChangeSchema,
};
