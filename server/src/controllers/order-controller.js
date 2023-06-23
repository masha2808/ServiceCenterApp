const orderService = require('./../services/order-service');
const orderSchemas = require('./../schemas/order-schema');

const createOrder = async (req, res) => {
  try {
    const data = req.body;
    await orderSchemas.createOrderSchema.validateAsync(data);
    const order = await orderService.createOrder(req.user, data);
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const updateOrder = async (req, res) => {
  try {
    const data = req.body;
    await orderSchemas.updateOrderSchema.validateAsync(data);
    const order = await orderService.updateOrder(req.user, req.params.id, data);
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listOrders = async (req, res) => {
  try {
    const orders = await orderService.listOrders(req.user);
    res.status(200).send(orders);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const listClientOrders = async (req, res) => {
  try {
    const applications = await orderService.listClientOrders(req.user);
    res.status(200).send(applications);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const getOrderByNumber = async (req, res) => {
  try {
    const orders = await orderService.getOrderByNumber(req.params.number);
    res.status(200).send(orders);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

const deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.user, req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  listOrders,
  listClientOrders,
  getOrderByNumber,
  createOrder,
  updateOrder,
  deleteOrder
}