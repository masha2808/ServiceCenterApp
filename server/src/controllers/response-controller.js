const responseService = require('./../services/response-service');
const responseSchemas = require('../schemas/response-schemas');

const listResponsesByServiceCenterId = async (req, res) => {
  try {
    const responses = await responseService.listResponsesByServiceCenterId(req.params.id);
    res.status(200).send(responses);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const createResponse = async (req, res) => {
  try {
    const data = req.body;
    await responseSchemas.createResponseSchema.validateAsync(data);
    const response = await responseService.createResponse(req.user, data);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  listResponsesByServiceCenterId,
  createResponse
};
