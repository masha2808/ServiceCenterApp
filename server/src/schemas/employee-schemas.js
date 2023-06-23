const joi = require('joi');

const createEmployeeSchema = joi.object({
  email: joi.string().email().required(),
  firstName: joi.string().required(),
  middleName: joi.string().allow(null, ""),
  lastName: joi.string().required(),
  dateOfBirth: joi.date().required(),
  phone: joi.string().required(),
  position: joi.string().required(),
  cooperationStartDate: joi.string().required(),
  cooperationEndDate: joi.string().allow(null, ""),
});

const updateEmployeeSchema = joi.object({
  firstName: joi.string().required(),
  middleName: joi.string().allow(null, ""),
  lastName: joi.string().required(),
  dateOfBirth: joi.date().required(),
  phone: joi.string().required(),
  position: joi.string().required(),
  cooperationStartDate: joi.string().required(),
  cooperationEndDate: joi.string().allow(null, ""),
});

module.exports = { 
  createEmployeeSchema,
  updateEmployeeSchema
};