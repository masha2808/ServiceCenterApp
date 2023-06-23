const router = require('express').Router();
const { authenticationMiddleware } = require('../middelwares/authentication-middleware');
const authenticationController = require('./../controllers/authentication-controller');

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.register);
router.post('/changePassword', authenticationMiddleware, authenticationController.changePassword);

module.exports = router;
