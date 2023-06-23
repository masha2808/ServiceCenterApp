const Task = require('../models/task-model');
const Status = require('../models/status-model');
const Employee = require('../models/employee-model');
const ServiceCenter = require('../models/service-center-model');
const DbHelper = require('../helpers/db-helper');

const createTask = async (user, data) => {
  await DbHelper.createConnection();

  const serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }

  const employee = await Employee.findOne({ where: { id: data.employeeId } });
  if (!employee) {
    throw new Error('Працівника не знайдено');
  }

  let status;
  try {
    status = await Status.create({
      plannedDateCompleted: data.plannedDateCompleted || null,
    });
  } catch (error) {
    throw new Error(`Помилка при створенні статусу. ${error.message}`)
  }

  let task;
  try {
    task = await Task.create({
      statusId: status.id,
      orderId: data.orderId,
      serviceCenterId: serviceCenter.id,
      employeeId: data.employeeId,
      name: data.name,
      description: data.description,
    });
  } catch (error) {
    await Status.destroy({ where: { id: status.id } });
    throw new Error(`Помилка при створенні завдання. ${error.message}`)
  }

  const sequelize = DbHelper.getSequalize();

  [task, ] = await sequelize.query(`
    SELECT tasks.*, users."firstName", users."lastName", users."middleName", orders."number" AS "orderNumber",
    status.name AS "statusName", status."plannedDateCompleted", status."dateCompleted", status."comment", status."dateTimeCreated"  
    FROM tasks
    INNER JOIN statuses AS status ON tasks."statusId" = status.id
    LEFT JOIN orders ON tasks."orderId" = orders.id
    INNER JOIN employees ON tasks."employeeId" = employees.id
    INNER JOIN users ON employees."userId" = users.id
    WHERE tasks.id = ${task.id}
  `);

  await DbHelper.closeConnection();

  return task[0];
}

const updateTask = async (user, id, data) => {
  await DbHelper.createConnection();

  const serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }

  let task = await Task.findOne({ where: { id, serviceCenterId: serviceCenter.id }});

  if (!task) {
    throw new Error('Завдання не знайдено');
  }

  try {
    await Status.update({
      name: data.statusName,
      comment: data.comment,
      plannedDateCompleted: data.plannedDateCompleted || null,
      dateCompleted: data.dateCompleted || null,
    }, { where: { id: task.statusId } });
  } catch (error) {
    throw new Error(`Помилка при оновленні статусу. ${error.message}`)
  }

  try {
    task = await Task.update({
      employeeId: data.employeeId,
      name: data.name,
      description: data.description,
    }, { where: { id } });
  } catch (error) {
    throw new Error(`Помилка при оновленні завдання. ${error.message}`);
  }

  const sequelize = DbHelper.getSequalize();

  [task, ] = await sequelize.query(`
    SELECT tasks.*, users."firstName", users."lastName", users."middleName", orders."number" AS "orderNumber",
    status.name AS "statusName", status."plannedDateCompleted", status."dateCompleted", status."comment", status."dateTimeCreated"  
    FROM tasks
    INNER JOIN statuses AS status ON tasks."statusId" = status.id
    LEFT JOIN orders ON tasks."orderId" = orders.id
    INNER JOIN employees ON tasks."employeeId" = employees.id
    INNER JOIN users ON employees."userId" = users.id
    WHERE tasks.id = ${id}
  `);

  await DbHelper.closeConnection();

  return task[0];
}

const updateTaskAsEmployee = async (user, id, data) => {
  await DbHelper.createConnection();

  let task = await Task.findOne({ where: { id }});

  if (!task) {
    throw new Error('Завдання не знайдено');
  }

  const employee = await Employee.findOne({ where: { userId: user.id } });

  if (employee.id !== task.employeeId) {
    throw new Error('Завдання належить іншому працівнику');
  }

  try {
    await Status.update({
      name: data.statusName,
      comment: data.comment,
    }, { where: { id: task.statusId } });
  } catch (error) {
    throw new Error(`Помилка при оновленні статусу. ${error.message}`)
  }

  const sequelize = DbHelper.getSequalize();

  [task, ] = await sequelize.query(`
    SELECT tasks.*, users."firstName", users."lastName", users."middleName", users.photo, orders."number" AS "orderNumber",
    status.name AS "statusName", status."plannedDateCompleted", status."dateCompleted", status."comment", status."dateTimeCreated"  
    FROM tasks
    INNER JOIN statuses AS status ON tasks."statusId" = status.id
    LEFT JOIN orders ON tasks."orderId" = orders.id
    INNER JOIN employees ON tasks."employeeId" = employees.id
    INNER JOIN users ON employees."userId" = users.id
    WHERE tasks.id = ${id}
  `);

  await DbHelper.closeConnection();

  if (task[0].photo) {
    task[0].photo = task[0].photo.toString("base64");
  }

  return task[0];
}

const listTasks = async (user) => {
  await DbHelper.createConnection();
  
  let serviceCenter;
  if (user.role === "administrator") {
    serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } })
  } else {
    const employee = await Employee.findOne({ where: { userId: user.id } })
    serviceCenter = await ServiceCenter.findOne({ where: { id: employee.serviceCenterId } })
  }

  if (!serviceCenter) {
    throw new Error("Сервісний центр не знайдено");
  }

  const sequelize = DbHelper.getSequalize();

  const [taskList, ] = await sequelize.query(`
    SELECT tasks.*, users."firstName", users."lastName", users."middleName", users.photo, orders."number" AS "orderNumber",
    status.name AS "statusName", status."plannedDateCompleted", status."dateCompleted", status."comment", status."dateTimeCreated"  
    FROM tasks
    INNER JOIN statuses AS status ON tasks."statusId" = status.id
    LEFT JOIN orders ON tasks."orderId" = orders.id
    INNER JOIN employees ON tasks."employeeId" = employees.id
    INNER JOIN users ON employees."userId" = users.id
    WHERE tasks."serviceCenterId" = ${serviceCenter.id}
`);

  await DbHelper.closeConnection();

  taskList.forEach(task => {
    if (task.photo) {
      task.photo = task.photo.toString("base64");
    }
  });

  return {
    taskList
  };
}

const deleteTask = async (user, id) => {
  await DbHelper.createConnection();

  const serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }

  const task = await Task.findOne({ where: { id, serviceCenterId: serviceCenter.id }});

  try {
    await Status.destroy({ where: { id: task.statusId } });
    await Task.destroy({ where: { id } });
  } catch (error) {
    throw new Error(`Помилка при видаленні завдання. ${error.message}`);
  }
  
  await DbHelper.closeConnection();

  return task;
}

module.exports = {
  createTask,
  updateTask,
  updateTaskAsEmployee,
  listTasks,
  deleteTask
}