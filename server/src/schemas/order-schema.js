const joi = require('joi');

const createOrderSchema = joi.object({
  clientId: joi.number().allow(null, ""),
  applicationId: joi.number().allow(null, ""),
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
  price: joi.number().required(),
  plannedDateCompleted: joi.date().allow(null, ""),
});

const updateOrderSchema = joi.object({
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
  price: joi.number().required(),
  payed: joi.boolean().required(),
  plannedDateCompleted: joi.date().allow(null, ""),
  dateCompleted: joi.date().allow(null, ""),
  statusName: joi.string().valid('created', 'inProgress', 'completed', 'problem', 'canceled').required(),
  comment: joi.string().allow(null, ""),
});

const getOrderByNumberSchema = joi.object({
  number: joi.string().regex(/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/)
});

module.exports = { 
  createOrderSchema,
  updateOrderSchema,
  getOrderByNumberSchema
};