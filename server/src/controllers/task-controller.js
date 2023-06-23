const taskService = require('./../services/task-service');
const taskSchemas = require('./../schemas/task-schema');

const createTask = async (req, res) => {
  try {
    const data = req.body;
    await taskSchemas.createTaskSchema.validateAsync(data);
    const task = await taskService.createTask(req.user, data);
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateTask = async (req, res) => {
  try {
    const data = req.body;
    await taskSchemas.updateTaskSchema.validateAsync(data);
    const task = await taskService.updateTask(req.user, req.params.id, data);
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateTaskAsEmployee = async (req, res) => {
  try {
    const data = req.body;
    await taskSchemas.updateTaskAsEmployeeSchema.validateAsync(data);
    const task = await taskService.updateTaskAsEmployee(req.user, req.params.id, data);
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listTasks = async (req, res) => {
  try {
    const tasks = await taskService.listTasks(req.user);
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.user, req.params.id);
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  updateTaskAsEmployee,
  deleteTask
}