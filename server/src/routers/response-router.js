const router = require('express').Router();
const { clientMiddleware } = require('../middelwares/client-middleware');
const responseController = require('./../controllers/response-controller');

router.get('/listResponsesByServiceCenterId/:id', responseController.listResponsesByServiceCenterId);
router.post('/create', clientMiddleware, responseController.createResponse);

module.exports = router;
