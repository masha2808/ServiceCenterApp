const cityService = require('./../services/city-service');

const createCity = async (req, res) => {
  try {
    const data = req.body;
    const city = await cityService.createCity(data);
    res.status(200).send(city);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateCity = async (req, res) => {
  try {
    const data = req.body;
    const city = await cityService.updateCity(req.params.id, data);
    res.status(200).send(city);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listCities = async (req, res) => {
  try {
    const cities = await cityService.listCities();
    res.status(200).send(cities);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  createCity,
  updateCity,
  listCities
}