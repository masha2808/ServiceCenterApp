const router = require('express').Router();
const categoryController = require('./../controllers/category-controller');

router.get('/list', categoryController.listCategories);
router.post('/create', categoryController.createCategory);
router.put('/update/:id', categoryController.updateCategory);

module.exports = router;
