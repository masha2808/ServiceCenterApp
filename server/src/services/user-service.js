const bcrypt = require('bcrypt');

const User = require('../models/user-model');

const DbHelper = require('../helpers/db-helper');

const getUser = async (data) => {
  await DbHelper.createConnection();

  const user = await User.findOne({ where: { id: data.id } });
  if (!user) {
    await DbHelper.closeConnection();
    throw new Error('Користувача не знайдено');
  }

  await DbHelper.closeConnection();

  if (user.photo) {
    user.photo = user.photo.toString("base64")
  }

  return user;
}

const updateUser = async (user, data, photo) => {
  await DbHelper.createConnection();

  let updatedUser = await User.findOne({ id: user.id });

  if (!updatedUser) {
    await DbHelper.closeConnection();
    throw new Error('Користувача не знайдено');
  }

  if (updatedUser.role === "employee") {
    await DbHelper.closeConnection();
    throw new Error('Користувача з роллю "Працівник" не можна редагувати');
  }

  try {
    updatedUser = await User.update({ ...data, photo: photo?.data || null }, { where: { id: user.id } });
  } catch (e) {
    await DbHelper.closeConnection();
    throw new Error(e.message);
  }

  updatedUser = await User.findOne({ where: { id: user.id } });

  await DbHelper.closeConnection();

  if (updatedUser.photo) {
    updatedUser.photo = updatedUser.photo.toString("base64")
  }

  return updatedUser;
}

module.exports = {
  getUser,
  updateUser
};