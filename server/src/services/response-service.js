const bcrypt = require('bcrypt');

const Response = require('../models/response-model');

const DbHelper = require('../helpers/db-helper');

const listResponses = async (serviceCenterId) => {
  const sequelize = DbHelper.getSequalize();

  const [responses, ] = await sequelize.query(`
    SELECT responses.*, users."firstName", users."lastName", users."middleName", users.photo FROM responses
    INNER JOIN users ON responses."clientId" = users.id
    WHERE responses."serviceCenterId" = ${serviceCenterId}
  `)
  
  responses.forEach(response => {
    if (response.photo) {
      response.photo = response.photo.toString("base64");
    }
  });

  return responses;
}

const listResponsesByServiceCenterId = async (serviceCenterId) => {
  await DbHelper.createConnection();
  
  const responseList = await listResponses(serviceCenterId);

  await DbHelper.closeConnection();

  return { responseList };
}

const createResponse = async (user, data) => {
  await DbHelper.createConnection();

  let response;
  try {
    response = await Response.create({
      serviceCenterId: data.serviceCenterId,
      clientId: user.id,
      rating: data.rating,
      text: data.text
    });
  } catch (e) {
    throw new Error(`Помилка при створенні відгуку. ${e.message}`);
  }

  const responseList = await listResponses(data.serviceCenterId);

  await DbHelper.closeConnection();

  return { responseList };
}

module.exports = {
  listResponsesByServiceCenterId,
  createResponse
};