const joi = require('joi');

const createServiceCenterSchema = joi.object({
  name: joi.string().required(),
  shortDescription: joi.string().required(),
  description: joi.string().required(),
  address: joi.string().required(),
  phone: joi.string().required(),
  email: joi.string().required(),
  mapLatitude: joi.number().allow(null, ""),
  mapLongitude: joi.number().allow(null, ""),
  cityId: joi.number().required(),
  categoryIdList: joi.array().items(joi.number()).required(),
});

const updateServiceCenterSchema = joi.object({
  name: joi.string(),
  shortDescription: joi.string(),
  description: joi.string(),
  address: joi.string(),
  phone: joi.string(),
  email: joi.string(),
  mapLatitude: joi.number(),
  mapLongitude: joi.number(),
  cityId: joi.number(),
  categoryIdList: joi.array().items(joi.number()),
});

const listServiceCenterSchema = joi.object({
  cityIdList: joi.array().items(joi.number()),
  categoryIdList: joi.array().items(joi.number()),
});

module.exports = { 
  createServiceCenterSchema,
  updateServiceCenterSchema,
  listServiceCenterSchema
};