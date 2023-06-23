const router = require('express').Router();
const cityController = require('./../controllers/city-controller');

router.get('/list', cityController.listCities);
router.post('/create', cityController.createCity);
router.put('/update/:id', cityController.updateCity);

module.exports = router;
