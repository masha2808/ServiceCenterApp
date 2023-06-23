const joi = require('joi');

const registrationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
  role: joi.string().valid('client', 'administrator').required(),
  firstName: joi.string().required(),
  middleName: joi.string().allow(null, ""),
  lastName: joi.string().required(),
  dateOfBirth: joi.date().required(),
  phone: joi.string().required()
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required()
});

const changePasswordSchema = joi.object({
  password: joi.string().min(3).required(),
  newPassword: joi.string().min(3).required()
});

module.exports = { 
  registrationSchema,
  loginSchema,
  changePasswordSchema
};