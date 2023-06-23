const Order = require('../models/order-model');
const Status = require('../models/status-model');
const ObjectData = require('../models/object-data-model');
const ClientContacts = require('../models/client-contacts-model');
const Employee = require('../models/employee-model');
const ServiceCenter = require('../models/service-center-model');
const DbHelper = require('../helpers/db-helper');
const EmailHelper = require('../helpers/email-helper');
const ValueHelper = require('../helpers/value-helper');

const createOrder = async (user, data) => {
  await DbHelper.createConnection();

  const serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });
  if (!serviceCenter) {
    throw new Error('Сервісний центр не знайдено');
  }
  
  let clientContacts;
  try {
    clientContacts = await ClientContacts.create({ 
      clientId: data.clientId,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      deliveryFromServiceCenter: data.deliveryToServiceCenter,
      deliveryToServiceCenter: data.deliveryToServiceCenter,
      address: data.address,
    });
  } catch (error) {
    throw new Error(`Помилка при додаванні контактів клієнта. ${error.message}`)
  }

  let objectData;
  try {
    objectData = await ObjectData.create({
      objectType: data.objectType,
      model: data.model,
      description: data.description
    });
  } catch (error) {
    await ClientContacts.destroy({ where: { id: clientContacts.id } });
    throw new Error(`Помилка при додаванні даних об'єкта. ${error.message}`)
  }

  let status;
  try {
    status = await Status.create({
      plannedDateCompleted: data.plannedDateCompleted || null,
    });
  } catch (error) {
    await ClientContacts.destroy({ where: { id: clientContacts.id } });
    await ObjectData.destroy({ where: { id: objectData.id } });
    throw new Error(`Помилка при створенні статусу. ${error.message}`)
  }

  let order;
  try {
    order = await Order.create({
      applicationId: data.applicationId,
      serviceCenterId: serviceCenter.id,
      objectDataId: objectData.id,
      clientContactsId: clientContacts.id,
      statusId: status.id,
      price: data.price,
      number: ValueHelper.generateNumber()
    });
  } catch (error) {
    await ClientContacts.destroy({ where: { id: clientContacts.id } });
    await ObjectData.destroy({ where: { id: objectData.id } });
    await Status.destroy({ where: { id: status.id } });
    throw new Error(`Помилка при створенні замовлення. ${error.message}`)
  }

  const sequelize = DbHelper.getSequalize();

  [order, ] = await sequelize.query(`
    SELECT orders.id, orders.number, orders."objectDataId", orders."serviceCenterId", orders."clientContactsId", orders.price, orders.payed,
      clientContacts."firstName", clientContacts."middleName", clientContacts."lastName", clientContacts."email",
      clientContacts."phone", clientContacts."clientId", clientContacts."deliveryToServiceCenter",
      clientContacts."deliveryFromServiceCenter", clientContacts."address",
      objectData."objectType", objectData.model, objectData.description,
      status."dateTimeCreated", status.name AS "statusName", status.comment, status."plannedDateCompleted", status."dateCompleted"
    FROM orders
    INNER JOIN public."clientContacts" AS clientContacts ON orders."clientContactsId" = clientContacts.id
    INNER JOIN public."objectData" AS objectData ON orders."objectDataId" = objectData.id
    INNER JOIN public."statuses" AS status ON orders."statusId" = status.id
    WHERE orders.id = ${order.id}
  `);

  await DbHelper.closeConnection();

  await EmailHelper.sendOrderLetter(clientContacts.email, order[0].number);

  return order[0];
}

const updateOrder = async (user, id, data) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();
  
  let [order, ] = await sequelize.query(`
    SELECT orders.* FROM orders
    INNER JOIN public."serviceCenters" AS serviceCenter ON orders."serviceCenterId" = serviceCenter.id
    WHERE serviceCenter."administratorId" = ${user.id} AND orders.id = ${id}
  `);

  if (order.length === 0) {
    throw new Error("Замовлення для даного адміністратора не знайдено");
  }

  try {
     await ClientContacts.update({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      deliveryFromServiceCenter: data.deliveryToServiceCenter,
      deliveryToServiceCenter: data.deliveryToServiceCenter,
      address: data.address,
    }, { where: { id: order[0].clientContactsId } });
  } catch (error) {
    throw new Error(`Помилка при оновленні контактів клієнта. ${error.message}`)
  }

  try {
    await ObjectData.update({
      objectType: data.objectType,
      model: data.model,
      description: data.description
    }, { where: { id: order[0].objectDataId } });
  } catch (error) {
    throw new Error(`Помилка при оновленні даних об'єкта. ${error.message}`)
  }

  try {
    await Status.update({
      name: data.statusName,
      comment: data.comment,
      plannedDateCompleted: data.plannedDateCompleted || null,
      dateCompleted: data.dateCompleted || null,
    }, { where: { id: order[0].statusId } });
  } catch (error) {
    throw new Error(`Помилка при оновленні статусу. ${error.message}`)
  }

  try {
    order = await Order.update({
      price: data.price,
      payed: data.payed
    }, { where: { id } });
  } catch (error) {
    throw new Error(`Помилка при оновленні замовлення. ${error.message}`);
  }

  [order, ] = await sequelize.query(`
    SELECT orders.id, orders.number, orders."objectDataId", orders."serviceCenterId", orders."clientContactsId", orders.price, orders.payed,
	    clientContacts."firstName", clientContacts."middleName", clientContacts."lastName", clientContacts."email",
      clientContacts."phone", clientContacts."clientId", clientContacts."deliveryToServiceCenter",
      clientContacts."deliveryFromServiceCenter", clientContacts."address",
      objectData."objectType", objectData.model, objectData.description,
	    status."dateTimeCreated", status.name AS "statusName", status.comment, status."plannedDateCompleted", status."dateCompleted"
    FROM orders
    INNER JOIN public."clientContacts" AS clientContacts ON orders."clientContactsId" = clientContacts.id
    INNER JOIN public."objectData" AS objectData ON orders."objectDataId" = objectData.id
	  INNER JOIN public."statuses" AS status ON orders."statusId" = status.id
    WHERE orders.id = ${id}
  `);

  await DbHelper.closeConnection();

  return order[0];
}

const listOrders = async (user) => {
  await DbHelper.createConnection();
  
  const sequelize = DbHelper.getSequalize();

  let serviceCenter;
  if (user.role === "administrator") {
    serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } })
  } else {
    const employee = await Employee.findOne({ where: { userId: user.id } })
    serviceCenter = await ServiceCenter.findOne({ where: { id: employee.serviceCenterId } })
  }

  if (!serviceCenter) {
    throw new Error("Сервісний центр не знайдено");
  }

  const [orderList, ] = await sequelize.query(`
    SELECT orders.id, orders.number, orders."objectDataId", orders."serviceCenterId", orders."clientContactsId", orders.price, orders.payed,
	    clientContacts."firstName", clientContacts."middleName", clientContacts."lastName", clientContacts."email",
      clientContacts."phone", clientContacts."clientId", clientContacts."deliveryToServiceCenter",
      clientContacts."deliveryFromServiceCenter", clientContacts."address",
      objectData."objectType", objectData.model, objectData.description, application.number AS "applicationNumber",
	    status."dateTimeCreated", status.name AS "statusName", status.comment, status."plannedDateCompleted", status."dateCompleted"
    FROM orders
    INNER JOIN public."clientContacts" AS clientContacts ON orders."clientContactsId" = clientContacts.id
    INNER JOIN public."objectData" AS objectData ON orders."objectDataId" = objectData.id
	  INNER JOIN public."statuses" AS status ON orders."statusId" = status.id
	  LEFT JOIN public."applications" AS application ON orders."applicationId" = application.id
    INNER JOIN public."serviceCenters" AS serviceCenter ON orders."serviceCenterId" = serviceCenter.id AND serviceCenter.id = ${serviceCenter.id}
  `);

  await DbHelper.closeConnection();

  return {
    orderList
  };
}

const listClientOrders = async (user) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();

  const [orderClientList,] = await sequelize.query(`
    SELECT orders.id, orders.number, orders."objectDataId", orders."serviceCenterId", orders."clientContactsId", orders.price, orders.payed,
      objectData."objectType", objectData.model, objectData.description, application.number AS "applicationNumber",
      serviceCenter.name, serviceCenter.address, serviceCenter.email, serviceCenter.phone, city.name AS "cityName", 
      status."dateTimeCreated", status.name AS "statusName", status.comment, status."plannedDateCompleted", status."dateCompleted"
    FROM orders
    INNER JOIN public."clientContacts" AS clientContacts ON orders."clientContactsId" = clientContacts.id AND clientContacts."clientId" = ${user.id}
    INNER JOIN public."objectData" AS objectData ON orders."objectDataId" = objectData.id
    INNER JOIN public."statuses" AS status ON orders."statusId" = status.id
    INNER JOIN public."serviceCenters" AS serviceCenter ON orders."serviceCenterId" = serviceCenter.id
    INNER JOIN public."cities" AS city ON serviceCenter."cityId" = city.id
    LEFT JOIN public."applications" AS application ON orders."applicationId" = application.id
  `);

  await DbHelper.closeConnection();

  return {
    orderClientList
  };
}

const getOrderByNumber = async (number) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();

  let order;
  try {
    [order] = await sequelize.query(`
      SELECT orders.id, orders.number, orders."objectDataId", orders."serviceCenterId", orders."clientContactsId", orders.price, orders.payed,
        objectData."objectType", objectData.model, objectData.description, application.number AS "applicationNumber",
        serviceCenter.name, serviceCenter.address, serviceCenter.email, serviceCenter.phone, city.name AS "cityName",
	      status."dateTimeCreated", status.name AS "statusName", status.comment, status."plannedDateCompleted", status."dateCompleted"
      FROM orders
      INNER JOIN public."clientContacts" AS clientContacts ON orders."clientContactsId" = clientContacts.id
      INNER JOIN public."objectData" AS objectData ON orders."objectDataId" = objectData.id
	    INNER JOIN public."statuses" AS status ON orders."statusId" = status.id
      INNER JOIN public."serviceCenters" AS serviceCenter ON orders."serviceCenterId" = serviceCenter.id
      INNER JOIN public."cities" AS city ON serviceCenter."cityId" = city.id
	    LEFT JOIN public."applications" AS application ON orders."applicationId" = application.id
      WHERE orders."number" = '${number}'
  `);
  } catch (error) {
    throw new Error(`Помилка отримання замовлення. ${error.message}`);
  }

  await DbHelper.closeConnection();

  if (order.length === 0) {
    throw new Error("Замовлення не знайдено");
  }

  return order[0];
}

const deleteOrder = async (user, id) => {
  await DbHelper.createConnection();
  
  const sequelize = DbHelper.getSequalize();

  let [order, ] = await sequelize.query(`
    SELECT orders.*, status.name AS "statusName" FROM orders
    INNER JOIN public."serviceCenters" AS serviceCenter ON orders."serviceCenterId" = serviceCenter.id
    INNER JOIN public."statuses" AS status ON orders."statusId" = status.id
    WHERE serviceCenter."administratorId" = ${user.id} AND orders.id = ${id}
  `);

  if (order.length === 0) {
    throw new Error("Замовлення для даного адміністратора не знайдено");
  }

  if (order[0].statusName !== "canceled") {
    throw new Error(`Можна видаляти лише замовлення зі статусом "Скасовано"`);
  }

  try {
    await ClientContacts.destroy({ where: { id: order[0].clientContactsId } });
    await ObjectData.destroy({ where: { id: order[0].objectDataId } });
    await Status.destroy({ where: { id: order[0].statusId } });
    await Order.destroy({ where: { id: order[0].id } });
  } catch (error) {
    throw new Error(`Помилка при видаленні замовлення. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return order;
}

module.exports = {
  createOrder,
  updateOrder,
  listOrders,
  listClientOrders,
  getOrderByNumber,
  deleteOrder
}