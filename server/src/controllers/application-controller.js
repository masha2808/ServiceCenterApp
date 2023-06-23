const applicationService = require('./../services/application-service');
const applicationSchemas = require('./../schemas/application-schema');

const createApplication = async (req, res) => {
  try {
    const data = req.body;
    await applicationSchemas.createApplicationSchema.validateAsync(data);
    const application = await applicationService.createApplication(req.user, data);
    res.status(200).send(application);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateApplication = async (req, res) => {
  try {
    const data = req.body;
    const application = await applicationService.updateApplication(req.user, req.params.id, data);
    res.status(200).send(application);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listApplications = async (req, res) => {
  try {
    const applications = await applicationService.listApplications(req.user);
    res.status(200).send(applications);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listClientApplications = async (req, res) => {
  try {
    const applications = await applicationService.listClientApplications(req.user);
    res.status(200).send(applications);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const getApplicationByNumber = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationByNumber(req.params.number);
    res.status(200).send(applications);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const deleteApplication = async (req, res) => {
  try {
    await applicationService.deleteApplication(req.user, req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  getApplicationByNumber,
  listApplications,
  listClientApplications,
  createApplication,
  updateApplication,
  deleteApplication
}