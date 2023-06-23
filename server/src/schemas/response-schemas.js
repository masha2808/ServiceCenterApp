const joi = require('joi');

const createResponseSchema = joi.object({
  serviceCenterId: joi.number().required(),
  rating: joi.number().min(1).max(5).required(),
  text: joi.string().allow(null, "")
});

module.exports = { 
  createResponseSchema,
};