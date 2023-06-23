const router = require('express').Router();
const { administratorMiddleware } = require('../middelwares/administrator-middleware');
const { administratorEmployeeMiddleware } = require('../middelwares/administrator-employee-middleware');
const serviceCenterController = require('./../controllers/service-center-controller');

router.get('/list', serviceCenterController.listServiceCenter);
router.get('/get/:id', serviceCenterController.getServiceCenter);
router.get('/getServiceCenterManagement', administratorEmployeeMiddleware, serviceCenterController.getServiceCenterManagement);
router.get('/getServiceCenterAdministratorData/:id', administratorEmployeeMiddleware, serviceCenterController.getServiceCenterAdministratorData);
router.post('/create', administratorMiddleware, serviceCenterController.createServiceCenter);
router.put('/update', administratorMiddleware, serviceCenterController.updateServiceCenter);
router.delete('/delete', administratorMiddleware, serviceCenterController.deleteServiceCenter);

module.exports = router;
