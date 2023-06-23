const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/user-model');
const Task = require('../models/task-model');
const Status = require('../models/status-model');
const Employee = require('../models/employee-model');
const Credentials = require('../models/credentials-model');
const ServiceCenter = require('../models/service-center-model');
const EmailHelper = require('../helpers/email-helper');
const DbHelper = require('../helpers/db-helper');

const createEmployee = async (user, data, photo) => {
  await DbHelper.createConnection();

  let serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }

  let employee = await User.findOne({ where: { email: data.email } });
  if (employee) {
    throw new Error('Email вже використвується');
  }

  const password = crypto.randomBytes(10).toString('hex').slice(0, 10);

  try {
    await Credentials.create({
      email: data.email,
      password: await bcrypt.hash(password, 10)
    });
  } catch (error) {
    throw new Error(`Помилка при створенні облікових даних користувача. ${error.message}`)
  }

  try {
    employee = await User.create({
      email: data.email,
      role: "employee",
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      phone: data.phone,
      photo: photo?.data || null
    });
  } catch (error) {
    await Credentials.destroy({ where: { email: data.email } });
    throw new Error(`Помилка при створенні користувача. ${error.message}`)
  }

  try {
    employee = await Employee.create({
      userId: employee.id,
      serviceCenterId: serviceCenter.id,
      position: data.position,
      cooperationStartDate: data.cooperationStartDate,
      cooperationEndDate: data.cooperationEndDate || null,
    });
  } catch (error) {
    await Credentials.destroy({ where: { email: data.email } });
    await User.destroy({ where: { id: employee.id } });
    throw new Error(`Помилка при створенні працівника. ${error.message}`)
  }

  //await EmailHelper.sendOrderLetter(data.email, order.number);
  await EmailHelper.sendEmployeeLetter(data.email, data.email, password);

  const sequelize = DbHelper.getSequalize();

  [ employee, ] = await sequelize.query(`SELECT employees.*, 
    users."firstName", users."lastName", users."middleName", users."dateOfBirth", users.phone, users.email, users.photo FROM employees
    INNER JOIN users ON employees."userId" = users.id
    WHERE employees.id = ${employee.id}
  `);

  await DbHelper.closeConnection();

  if (employee[0].photo) {
    employee[0].photo = employee[0].photo.toString("base64");
  }

  return employee[0];
}

const updateEmployee = async (user, id, data, photo) => {
  await DbHelper.createConnection();

  let serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }

  let employee = await Employee.findOne({ where: { id } });
  if (!employee) {
    throw new Error('Працівника не знайдено');
  }

  if (employee.serviceCenterId !== serviceCenter.id) {
    throw new Error('Користувач не є працівником цього сервісного центру');
  }

  try {
    employee = await User.update({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      phone: data.phone,
      photo: photo?.data || null
    }, { where: { id: employee.userId } });
  } catch (error) {
    throw new Error(`Помилка при редагуванні користувача. ${error.message}`)
  }

  try {
    employee = await Employee.update({
      userId: employee.id,
      position: data.position,
      cooperationStartDate: data.cooperationStartDate,
      cooperationEndDate: data.cooperationEndDate || null,
    }, { where: { id } });
  } catch (error) {
    throw new Error(`Помилка при редагуванні працівника. ${error.message}`)
  }

  const sequelize = DbHelper.getSequalize();

  [ employee, ] = await sequelize.query(`SELECT employees.*, 
    users."firstName", users."lastName", users."middleName", users."dateOfBirth", users.phone, users.email, users.photo FROM employees
    INNER JOIN users ON employees."userId" = users.id
    WHERE employees.id = ${id}
  `);

  await DbHelper.closeConnection();

  if (employee[0].photo) {
    employee[0].photo = employee[0].photo.toString("base64");
  }

  return employee[0];
}

const listEmployees = async (user) => {
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

  const [employeeList, ] = await sequelize.query(` SELECT employees.*, 
    users."firstName", users."lastName", users."middleName", users."dateOfBirth", users.phone, users.email, users.photo FROM employees
    INNER JOIN users ON employees."userId" = users.id
    WHERE employees."serviceCenterId" = ${serviceCenter.id}
  `);

  await DbHelper.closeConnection();

  employeeList.forEach(employee => {
    if (employee.photo) {
      employee.photo = employee.photo.toString("base64");
    }
  });

  return { employeeList };
}

const deleteEmployee = async (user, id) => {
  await DbHelper.createConnection();

  const serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }

  const sequelize = DbHelper.getSequalize();

  const [ employee, ] = await sequelize.query(`SELECT employees.*, 
    users."firstName", users."lastName", users."middleName", users."dateOfBirth", users.phone, users.email, users.photo FROM employees
    INNER JOIN users ON employees."userId" = users.id
    WHERE employees.id = ${id}
  `);

  
  if (!employee[0]) {
    throw new Error('Дані працівника не знайдено');
  }
  
  const taskList = await Task.findAll({where: { employeeId: employee[0].id }});

  taskList.forEach(async task => {
    try {
      await Status.destroy({ where: { id: task.statusId } });
      await Task.destroy({ where: { id: task.id } });
    } catch (error) {
      throw new Error(`Помилка при видаленні завдання. ${error.message}`);
    }
  });

  await Employee.destroy({ where: { id }});

  await DbHelper.closeConnection();

  return employee[0];
}

module.exports = {
  createEmployee,
  updateEmployee,
  listEmployees,
  deleteEmployee
};