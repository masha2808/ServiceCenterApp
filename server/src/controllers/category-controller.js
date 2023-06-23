const categoryService = require('./../services/category-service');

const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = await categoryService.createCategory(data);
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = await categoryService.updateCategory(req.params.id, data);
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listCategories = async (req, res) => {
  try {
    const categories = await categoryService.listCategories();
    res.status(200).send(categories);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  createCategory,
  updateCategory,
  listCategories
}