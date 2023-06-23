const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');
const Credentials = require('../models/credentials-model');

const DbHelper = require('../helpers/db-helper');

const register = async (data, photo) => {
  await DbHelper.createConnection();

  let user = await User.findOne({ where: { email: data.email } });
  if (user) {
    throw new Error('Email вже використовується');
  }

  try {
    await Credentials.create({
      email: data.email,
      password: await bcrypt.hash(data.password, 10)
    });
  } catch (error) {
    throw new Error(`Помилка при створенні облікових даних користувача. ${error.message}`)
  }

  try {
    user = await User.create({
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      phone: data.phone,
      photo: photo?.data || null
    });
  } catch (error) {
    await Credentials.destroy({ where: { email: data.email } });
    throw new Error(`Помилка при створенні корситвуача у базі даниих. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return user;
}

const changePassword = async (user, data) => {
  await DbHelper.createConnection();

  let credentials = await Credentials.findOne({ where: { email: user.email } });
  if (!credentials) {
    throw new Error('Облікові дані користувача не знайдено');
  }

  if (!(await bcrypt.compare(data.password, credentials.password))) {
    throw new Error('Вказано неправильний пароль');
  }

  try {
    await Credentials.update({
      password: await bcrypt.hash(data.newPassword, 10)
    }, { where: { email: user.email } });
  } catch (error) {
    throw new Error(`Помилка при оновленні паролю. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return user;
}

const login = async (data) => {
  await DbHelper.createConnection();

  const credentials = await Credentials.findOne({ where: { email: data.email } });

  if (!credentials) {
    await DbHelper.closeConnection();
    throw new Error('Не правильний логін або пароль');
  }

  if (!(await bcrypt.compare(data.password, credentials.password))) {
    await DbHelper.closeConnection();
    throw new Error('Не правильний логін або пароль');
  }

  const user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    await DbHelper.closeConnection();
    throw new Error('Користувача не знайдено');
  }

  const token = jwt.sign({
    id: user.id,
    email: credentials.email,
    role: user.role
  }, 'secret');

  await DbHelper.closeConnection();
  return token;
}

module.exports = {
  register,
  changePassword,
  login
};