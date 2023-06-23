const serviceCenterSchemas = require("./../schemas/service-center-schemas");
const serviceCenterService = require("../services/service-center-service");

const listServiceCenter = async (req, res) => {
  try {
    const data = req.query;
    const serviceCenter = await serviceCenterService.listServiceCenter(data);
    res.status(200).send(serviceCenter);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const createServiceCenter = async (req, res) => {
  try {
    const data = req.body;
    data.categoryIdList = JSON.parse(data.categoryIdList)
    data.cityId = JSON.parse(data.cityId)
    await serviceCenterSchemas.createServiceCenterSchema.validateAsync(data);
    const serviceCenter = await serviceCenterService.createServiceCenter(req.user, data, req.files);
    res.status(200).send(serviceCenter);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const getServiceCenter = async (req, res) => {
  try {
    const id = req.params.id;
    const serviceCenter = await serviceCenterService.getServiceCenter(id);
    res.status(200).send(serviceCenter);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const getServiceCenterManagement = async (req, res) => {
  try {
    const serviceCenter = await serviceCenterService.getServiceCenterManagement(req.user);
    res.status(200).send(serviceCenter);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const getServiceCenterAdministratorData = async (req, res) => {
  try {
    const id = req.params.id;
    const administrator = await serviceCenterService.getServiceCenterAdministratorData(req.user, id);
    res.status(200).send(administrator);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateServiceCenter = async (req, res) => {
  try {
    const { mainPhoto, ...data } = req.body;
    data.categoryIdList = JSON.parse(data.categoryIdList)
    data.cityId = JSON.parse(data.cityId);
    await serviceCenterSchemas.createServiceCenterSchema.validateAsync(data);
    const serviceCenter = await serviceCenterService.updateServiceCenter(req.user, data, req.files);
    res.status(200).send(serviceCenter);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const deleteServiceCenter = async (req, res) => {
  try {
    await serviceCenterService.deleteServiceCenter(req.user);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  listServiceCenter,
  createServiceCenter,
  getServiceCenter,
  getServiceCenterManagement,
  getServiceCenterAdministratorData,
  updateServiceCenter,
  deleteServiceCenter
};
