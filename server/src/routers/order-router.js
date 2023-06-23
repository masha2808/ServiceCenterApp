const router = require('express').Router();
const orderController = require('./../controllers/order-controller');
const { clientMiddleware } = require('../middelwares/client-middleware');
const { administratorMiddleware } = require('../middelwares/administrator-middleware');
const { administratorEmployeeMiddleware } = require('../middelwares/administrator-employee-middleware');

router.get('/getByNumber/:number', orderController.getOrderByNumber);
router.get('/list', administratorEmployeeMiddleware, orderController.listOrders);
router.get('/listClientOrders', clientMiddleware, orderController.listClientOrders);
router.post('/create', administratorMiddleware, orderController.createOrder);
router.put('/update/:id', administratorMiddleware, orderController.updateOrder);
router.delete('/delete/:id', administratorMiddleware, orderController.deleteOrder);

module.exports = router;
