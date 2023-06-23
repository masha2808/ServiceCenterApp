const router = require('express').Router();
const photoController = require('./../controllers/photo-controller');

router.get('/listPhotosByServiceCenterId/:id', photoController.listPhotosByServiceCenterId);

module.exports = router;
