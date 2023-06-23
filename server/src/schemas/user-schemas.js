const joi = require('joi');

const updateUserSchema = joi.object({
  firstName: joi.string().required(),
  middleName: joi.string().allow(null, ''),
  lastName: joi.string().required(),
  dateOfBirth: joi.date().required(),
  phone: joi.string().required()
});

module.exports = {
  updateUserSchema
};