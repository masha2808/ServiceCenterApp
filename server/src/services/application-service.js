const Application = require('../models/application-model');
const ClientContacts = require('../models/client-contacts-model');
const ObjectData = require('../models/object-data-model');
const Employee = require('../models/employee-model');
const ServiceCenter = require('../models/service-center-model');
const DbHelper = require('../helpers/db-helper');
const EmailHelper = require('../helpers/email-helper');
const ValueHelper = require('../helpers/value-helper');

const createApplication = async (user, data) => {
  await DbHelper.createConnection();

  let clientContacts;
  try {
    clientContacts = await ClientContacts.create({
      clientId: user?.id || null,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      deliveryFromServiceCenter: data.deliveryToServiceCenter,
      deliveryToServiceCenter: data.deliveryToServiceCenter,
      address: data.address
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

  let application;
  try {
    application = await Application.create({
      serviceCenterId: data.serviceCenterId,
      objectDataId: objectData.id,
      clientContactsId: clientContacts.id,
      number: ValueHelper.generateNumber()
    });
  } catch (error) {
    await ClientContacts.destroy({ where: { id: clientContacts.id } });
    await ObjectData.destroy({ where: { id: objectData.id } });
    throw new Error(`Помилка при створенні заяви. ${error.message}`)
  }

  await DbHelper.closeConnection();

  await EmailHelper.sendApplicationLetter(clientContacts.email, application.number);

  return application;
}

const updateApplication = async (user, id, data) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();

  let [application,] = await sequelize.query(`
    SELECT application.* FROM public."applications" AS application
    INNER JOIN public."serviceCenters" AS serviceCenter ON application."serviceCenterId" = serviceCenter.id
    WHERE serviceCenter."administratorId" = ${user.id} AND application.id = ${id}
  `);

  if (application.length === 0) {
    throw new Error("Заяву для даного адміністратора не знайдено");
  }

  let [orderList,] = await sequelize.query(`
    SELECT orders.number from applications
    INNER JOIN orders ON orders."applicationId" = applications.id
    WHERE applications.id = ${id}
  `);

  if (orderList.length > 0) {
    throw new Error(`Не можливо встановити статус "Відхилено", тому що для заяви існують замовлення: ${orderList.map(item => item.number).join(', ')}`);
  }

  try {
    application = await Application.update(data, { where: { id } });
  } catch (error) {
    throw new Error(`Помилка при оновленні заяви. ${error.message}`)
  }

  application = await Application.findByPk(id);

  await DbHelper.closeConnection();

  return application;
}

const listApplications = async (user) => {
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

  const [applicationList,] = await sequelize.query(`
    SELECT application.id, application.number, application.status, application."dateTimeCreated", application.comment,
    	application."objectDataId", application."serviceCenterId", application."clientContactsId",
    	clientContacts."firstName", clientContacts."middleName", clientContacts."lastName", clientContacts."email",
    	clientContacts."phone", clientContacts."clientId", clientContacts."deliveryToServiceCenter",
    	clientContacts."deliveryFromServiceCenter", clientContacts."address",
    	objectData."objectType", objectData.model, objectData.description
    FROM public."applications" AS application
    INNER JOIN public."clientContacts" AS clientContacts ON application."clientContactsId" = clientContacts.id
    INNER JOIN public."objectData" AS objectData ON application."objectDataId" = objectData.id
    INNER JOIN public."serviceCenters" AS serviceCenter ON application."serviceCenterId" = serviceCenter.id AND serviceCenter.id = ${serviceCenter.id}
    ORDER BY application.number ASC
  `);

  await DbHelper.closeConnection();

  return {
    applicationList
  };
}

const listClientApplications = async (user) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();

  const [applicationClientList,] = await sequelize.query(`
    SELECT application.id, application.number, application.status, application."dateTimeCreated", application.comment,
      application."objectDataId", application."serviceCenterId", application."clientContactsId",
      serviceCenter.name, serviceCenter.address, serviceCenter.email, serviceCenter.phone,  
      objectData."objectType", objectData.model, objectData.description, city.name AS "cityName"
    FROM public."applications" AS application
    INNER JOIN public."clientContacts" AS clientContacts ON application."clientContactsId" = clientContacts.id AND clientContacts."clientId" = ${user.id}
    INNER JOIN public."objectData" AS objectData ON application."objectDataId" = objectData.id
    INNER JOIN public."serviceCenters" AS serviceCenter ON application."serviceCenterId" = serviceCenter.id
    INNER JOIN public."cities" AS city ON serviceCenter."cityId" = city.id
  `);

  await DbHelper.closeConnection();

  return {
    applicationClientList
  };
}

const getApplicationByNumber = async (number) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();

  let application;
  try {
    [application] = await sequelize.query(`
      SELECT application.id, application.number, application.status, application."dateTimeCreated", application.comment,
      	application."objectDataId", application."serviceCenterId", application."clientContactsId",
      	serviceCenter.name, serviceCenter.address, serviceCenter.email, serviceCenter.phone,  
      	objectData."objectType", objectData.model, objectData.description, city.name AS "cityName"
      FROM public."applications" AS application
      INNER JOIN public."objectData" AS objectData ON application."objectDataId" = objectData.id
      INNER JOIN public."clientContacts" AS clientContacts ON application."clientContactsId" = clientContacts.id
      INNER JOIN public."serviceCenters" AS serviceCenter ON application."serviceCenterId" = serviceCenter.id
      INNER JOIN public."cities" AS city ON serviceCenter."cityId" = city.id
	    WHERE application."number" = '${number}'
  `);
  } catch (error) {
    throw new Error(`Помилка отримання заяви. ${error.message}`);
  }

  await DbHelper.closeConnection();

  if (application.length === 0) {
    throw new Error("Заяву не знайдено");
  }

  return application[0];
}

const deleteApplication = async (user, id) => {
  await DbHelper.createConnection();

  const sequelize = DbHelper.getSequalize();

  let [application,] = await sequelize.query(`
    SELECT application.* FROM public."applications" AS application
    INNER JOIN public."serviceCenters" AS serviceCenter ON application."serviceCenterId" = serviceCenter.id
    WHERE serviceCenter."administratorId" = ${user.id} AND application.id = ${id}
  `);

  if (application.length === 0) {
    throw new Error("Заяву для даного адміністратора не знайдено");
  }

  if (application[0].status !== "refused") {
    throw new Error(`Можна видаляти лише заяви зі статусом "Відхилено"`);
  }

  try {
    await ClientContacts.destroy({ where: { id: application[0].clientContactsId } });
    await ObjectData.destroy({ where: { id: application[0].objectDataId } });
    await Application.destroy({ where: { id: application[0].id } });
  } catch (error) {
    throw new Error(`Помилка при видаленні заяви. ${error.message}`)
  }

  await DbHelper.closeConnection();

  return application;
}

module.exports = {
  createApplication,
  updateApplication,
  listApplications,
  listClientApplications,
  getApplicationByNumber,
  deleteApplication
}