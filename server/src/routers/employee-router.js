const router = require('express').Router();
const employeeController = require('./../controllers/employee-controller');
const { administratorMiddleware } = require('../middelwares/administrator-middleware');
const { administratorEmployeeMiddleware } = require('../middelwares/administrator-employee-middleware');

router.get('/list', administratorEmployeeMiddleware, employeeController.listEmployees);
router.post('/create', administratorMiddleware, employeeController.createEmployee);
router.put('/update/:id', administratorMiddleware, employeeController.updateEmployee);
router.delete('/delete/:id', administratorMiddleware, employeeController.deleteEmployee);

module.exports = router;
