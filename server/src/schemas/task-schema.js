const joi = require('joi');

const createTaskSchema = joi.object({
  orderId: joi.number().allow(null, ""),
  employeeId: joi.number().required(),
  name: joi.string().required(),
  description: joi.string().required(),
  plannedDateCompleted: joi.date().allow(null, ""),
});

const updateTaskSchema = joi.object({
  employeeId: joi.number().required(),
  name: joi.string().required(),
  description: joi.string().required(),
  plannedDateCompleted: joi.date().allow(null, ""),
  dateCompleted: joi.date().allow(null, ""),
  statusName: joi.string().valid('created', 'inProgress', 'completed', 'problem', 'canceled').required(),
  comment: joi.string().allow(null, ""),
});

const updateTaskAsEmployeeSchema = joi.object({
  plannedDateCompleted: joi.date().allow(null, ""),
  dateCompleted: joi.date().allow(null, ""),
  statusName: joi.string().valid('created', 'inProgress', 'completed', 'problem', 'canceled').required(),
  comment: joi.string().allow(null, ""),
});

module.exports = { 
  createTaskSchema,
  updateTaskSchema,
  updateTaskAsEmployeeSchema,
};