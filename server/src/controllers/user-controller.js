const userService = require('./../services/user-service');
const userSchemas = require('../schemas/user-schemas');

const getUser = async (req, res) => {
  try {
    const data = req.user;
    const user = await userService.getUser(data);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { photo, ...data } = req.body;
    await userSchemas.updateUserSchema.validateAsync(data);
    const user = await userService.updateUser(req.user, data, req.files.photo);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  getUser,
  updateUser
};
