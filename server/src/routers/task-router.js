const router = require('express').Router();
const taskController = require('./../controllers/task-controller');
const { employeeMiddleware } = require('../middelwares/employee-middleware');
const { administratorMiddleware } = require('../middelwares/administrator-middleware');
const { administratorEmployeeMiddleware } = require('../middelwares/administrator-employee-middleware');

router.get('/list', administratorEmployeeMiddleware, taskController.listTasks);
router.post('/create', administratorMiddleware, taskController.createTask);
router.put('/update/:id', administratorMiddleware, taskController.updateTask);
router.put('/updateAsEmployee/:id', employeeMiddleware, taskController.updateTaskAsEmployee);
router.delete('/delete/:id', administratorMiddleware, taskController.deleteTask);

module.exports = router;
