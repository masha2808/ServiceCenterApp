const employeeService = require('./../services/employee-service');
const employeeSchemas = require('./../schemas/employee-schemas');

const createEmployee = async (req, res) => {
  try {
    const data = req.body;
    await employeeSchemas.createEmployeeSchema.validateAsync(data);
    const employee = await employeeService.createEmployee(req.user, data, req.files?.photo);
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateEmployee = async (req, res) => {
  try {
    const { photo, ...data } = req.body;
    await employeeSchemas.updateEmployeeSchema.validateAsync(data);
    const employee = await employeeService.updateEmployee(req.user, req.params.id, data, req.files?.photo);
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listEmployees = async (req, res) => {
  try {
    const employees = await employeeService.listEmployees(req.user);
    res.status(200).send(employees);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const deleteEmployee = async (req, res) => {
  try {
    const employee = await employeeService.deleteEmployee(req.user, req.params.id);
    res.status(200).send(employee);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  listEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
}