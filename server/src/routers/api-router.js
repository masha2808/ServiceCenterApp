const router = require('express').Router();
const userRouter = require('./user-router');
const cityRouter = require('./city-router');
const taskRouter = require('./task-router');
const photoRouter = require('./photo-router');
const orderRouter = require('./order-router');
const categoryRouter = require('./category-router');
const responseRouter = require('./response-router');
const employeeRouter = require('./employee-router');
const applicationRouter = require('./application-router');
const serviceCenterRouter = require('./service-center-router');
const authenticationRouter = require('./authentication-router');

router.use('/user', userRouter);
router.use('/city', cityRouter);
router.use('/task', taskRouter);
router.use('/photo', photoRouter);
router.use('/order', orderRouter);
router.use('/category', categoryRouter);
router.use('/response', responseRouter);
router.use('/employee', employeeRouter);
router.use('/application', applicationRouter);
router.use('/serviceCenter', serviceCenterRouter);
router.use('/authentication', authenticationRouter);

module.exports = router;