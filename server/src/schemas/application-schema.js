const joi = require('joi');

const createApplicationSchema = joi.object({
  serviceCenterId: joi.number().required(),
  clientId: joi.number().allow(null, ""),
  firstName: joi.string().required(),
  middleName: joi.string().allow(null, ""),
  lastName: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  objectType: joi.string().required(),
  model: joi.string().allow(null, ""),
  deliveryToServiceCenter: joi.boolean().required(),
  deliveryFromServiceCenter: joi.boolean().required(),
  address: joi.string().allow(null, ""),
  description: joi.string().required(),
});

const updateApplicationSchema = joi.object({
  status: joi.string().valid('considered', 'accepted', 'refused').required(),
  comment: joi.string()
});

const getApplicationByNumberSchema = joi.object({
  number: joi.string().regex(/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/)
});

module.exports = { 
  createApplicationSchema,
  updateApplicationSchema,
  getApplicationByNumberSchema
};