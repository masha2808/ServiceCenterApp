const router = require('express').Router();
const applicationController = require('./../controllers/application-controller');
const { clientMiddleware } = require('../middelwares/client-middleware');
const { administratorMiddleware } = require('../middelwares/administrator-middleware');
const { administratorEmployeeMiddleware } = require('../middelwares/administrator-employee-middleware');

router.get('/getByNumber/:number', applicationController.getApplicationByNumber);
router.get('/list', administratorEmployeeMiddleware, applicationController.listApplications);
router.get('/listClientApplications', clientMiddleware, applicationController.listClientApplications);
router.post('/create', applicationController.createApplication);
router.post('/createAsClient', clientMiddleware, applicationController.createApplication);
router.put('/update/:id', administratorMiddleware, applicationController.updateApplication);
router.delete('/delete/:id', administratorMiddleware, applicationController.deleteApplication);

module.exports = router;
