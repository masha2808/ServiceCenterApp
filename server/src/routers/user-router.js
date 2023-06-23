const router = require('express').Router();
const { authenticationMiddleware } = require('../middelwares/authentication-middleware');
const userController = require('./../controllers/user-controller');

router.get('/get', authenticationMiddleware, userController.getUser);
router.put('/update', authenticationMiddleware, userController.updateUser);

module.exports = router;
