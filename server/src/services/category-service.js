const Category = require('../models/category-model');
const DbHelper = require('../helpers/db-helper');

const createCategory = async (data) => {
  await DbHelper.createConnection();
  
  let category;
  try {
    category = await Category.create({ name: data.name });
  } catch (error) {
    throw new Error(`Помилка при створенні категорії. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return category;
}

const updateCategory = async (id, data) => {
  await DbHelper.createConnection();
  
  let category;
  try {
    category = await Category.update(data, { where: { id } });
  } catch (error) {
    throw new Error(`Помилка при оновленні міста. ${error.message}`)
  }

  category = await Category.findByPk(id);

  await DbHelper.closeConnection();

  return category;
}

const listCategories = async (id, data) => {
  await DbHelper.createConnection();
  
  let categoryList;
  try {
    categoryList = await Category.findAll({ order: [ ["name", "ASC"] ] });
  } catch (error) {
    throw new Error(`Помилка отримання списку категорій. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return { categoryList };
}


module.exports = {
  createCategory,
  updateCategory,
  listCategories
}