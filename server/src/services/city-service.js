const City = require('../models/city-model');
const DbHelper = require('../helpers/db-helper');

const createCity = async (data) => {
  await DbHelper.createConnection();
  
  let city;
  try {
    city = await City.create({ name: data.name });
  } catch (error) {
    throw new Error(`Помилка при створенні міста. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return city;
}

const updateCity = async (id, data) => {
  await DbHelper.createConnection();
  
  let city;
  try {
    city = await City.update(data, { where: { id } });
  } catch (error) {
    throw new Error(`Помилка при оновленні міста. ${error.message}`)
  }

  city = await City.findByPk(id);

  await DbHelper.closeConnection();

  return city;
}

const listCities = async (id, data) => {
  await DbHelper.createConnection();
  
  let cityList;
  try {
    cityList = await City.findAll({ order: [ ["name", "ASC"] ] });
  } catch (error) {
    throw new Error(`Помилка отримання списку міст. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return { cityList };
}


module.exports = {
  createCity,
  updateCity,
  listCities
}