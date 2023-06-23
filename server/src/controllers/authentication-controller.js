const authenticationService = require('./../services/authentication-service');
const authenticationSchemas = require('../schemas/authentication-schemas');

const register = async (req, res) => {
  try {
    const data = req.body;
    await authenticationSchemas.registrationSchema.validateAsync(data);
    await authenticationService.register(data, req.files.photo);
    res.status(200).send({
      "message": "Profile created successfully"
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const login = async (req, res) => {
  try {
    const data = req.body;
    await authenticationSchemas.loginSchema.validateAsync(data);
    const jwtToken = await authenticationService.login(data);
    res.status(200).send({
      jwtToken
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const changePassword = async (req, res) => {
  try {
    const data = req.body;
    await authenticationSchemas.changePasswordSchema.validateAsync(data);
    const jwtToken = await authenticationService.changePassword(req.user, data);
    res.status(200).send({
      jwtToken
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  register,
  login,
  changePassword
}
