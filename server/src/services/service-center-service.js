const Task = require('../models/task-model');
const User = require('../models/user-model');
const Photo = require('../models/photo-model');
const Order = require('../models/order-model');
const Status = require('../models/status-model');
const Employee = require('../models/employee-model');
const ObjectData = require('../models/object-data-model');
const Application = require('../models/application-model');
const ServiceCenter = require('../models/service-center-model');
const ClientContacts = require('../models/client-contacts-model');
const ServiceCenterCategory = require('../models/service-center-category-model');
const DbHelper = require('../helpers/db-helper');

const getServiceCenterQuery = async (fieldName, id) => {
  const sequelize = DbHelper.getSequalize();
 
  const [serviceCenter, ] = await sequelize.query(`SELECT serviceCenter.*, responses.rating, city.name AS "cityName", categories."categoryNameArray", categories."categoryIdArray" FROM public."serviceCenters" AS serviceCenter
    INNER JOIN public."cities" AS city ON serviceCenter."${fieldName}" = ${id} AND serviceCenter."cityId" = city.id
    INNER JOIN (
      SELECT serviceCenterCategory."serviceCenterId", array_agg(category.name) AS "categoryNameArray",  array_agg(category.id) AS "categoryIdArray"
      FROM public."serviceCenterCategories" AS serviceCenterCategory
      INNER JOIN public.categories AS category ON category.id = serviceCenterCategory."categoryId"
      GROUP BY serviceCenterCategory."serviceCenterId"
    ) categories ON categories."serviceCenterId" = serviceCenter.id
    LEFT JOIN (
      SELECT response."serviceCenterId", avg(response.rating) AS "rating"
      FROM public."responses" AS response
      GROUP BY response."serviceCenterId"
    ) responses ON responses."serviceCenterId" = serviceCenter.id`);

  if (serviceCenter.length === 0) {
    throw new Error("Сервісний центр не знайдено.");
  }

  if (serviceCenter[0].mainPhoto) {
    serviceCenter[0].mainPhoto = serviceCenter[0].mainPhoto.toString("base64");
  }

  return serviceCenter[0];
}

const getServiceCenter = async (id) => {
  await DbHelper.createConnection();
 
  const serviceCenter = await getServiceCenterQuery("id", id);

  await DbHelper.closeConnection();

  return serviceCenter;
}

const getServiceCenterManagement = async (user) => {
  await DbHelper.createConnection();

  let serviceCenter;
  if (user.role === "administrator") {
    serviceCenter = await getServiceCenterQuery("administratorId", user.id);
  } else {
    const employee = await Employee.findOne({ where: { userId: user.id } });
    serviceCenter = await getServiceCenterQuery("id", employee.serviceCenterId);
  }

  await DbHelper.closeConnection();

  return serviceCenter;
}

const getServiceCenterAdministratorData = async (user, id) => {
  await DbHelper.createConnection();

  let serviceCenter;
  if (user.role === "administrator") {
    serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } })
  } else {
    const employee = await Employee.findOne({ where: { userId: user.id } })
    serviceCenter = await ServiceCenter.findOne({ where: { id: employee.serviceCenterId } })
  }

  const administrator = await User.findByPk(serviceCenter.administratorId);
  
  await DbHelper.closeConnection();

  return administrator;
}

const createServiceCenter = async (user, data, files) => {
  await DbHelper.createConnection();

  let serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });

  if (serviceCenter) {
    throw new Error("Сервісний центр вже існує.");
  }

  try {
    serviceCenter = await ServiceCenter.create({
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      mapLatitude: data.mapLatitude || null,
      mapLongitude: data.mapLongitude || null,
      cityId: data.cityId,
      administratorId: user.id,
      mainPhoto: files.mainPhoto.data
    });
  } catch (e) {
    throw new Error(`Помилка при створенні сервісного центру. ${e.message}`)
  }

  try {
    const serviceCenterCategoryList = data.categoryIdList.map(categoryId => {
      return {
        categoryId,
        serviceCenterId: serviceCenter.id
      }
    });
    await ServiceCenterCategory.bulkCreate(serviceCenterCategoryList);
  } catch (e) {
    throw new Error(`Помилка при створенні категорій сервісного центру. ${e.message}`)
  }

  try {
    const { mainPhoto, ...photos } = files;
    const photoList = Object.values(photos).map(photo => {
      return {
        photo: photo.data,
        serviceCenterId: serviceCenter.id
      }
    });
    await Photo.bulkCreate(photoList);
  } catch (e) {
    throw new Error(`Помилка при додаванні фото сервісного центру. ${e.message}`)
  }

  serviceCenter = await getServiceCenterQuery("id", serviceCenter.id);

  await DbHelper.closeConnection();

  return serviceCenter;
}

const updateServiceCenter = async (user, data, files) => {
  await DbHelper.createConnection();

  let serviceCenter = await ServiceCenter.findOne({ where: { administratorId: user.id } });

  if (!serviceCenter) {
    throw new Error("Сервісний центр не знайдено.");
  }

  try {
    await ServiceCenter.update({
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      mapLatitude: data.mapLatitude || null,
      mapLongitude: data.mapLongitude || null,
      cityId: data.cityId,
      mainPhoto: files.mainPhoto?.data || null
    }, { where: { administratorId: user.id } });
  } catch (e) {
    throw new Error(`Помилка при оновленні сервісного центру. ${e.message}`)
  }

  if (data.categoryIdList !== null) {
    try {
      const oldServiceCenterCategoryList = await ServiceCenterCategory.findAll({ where: { serviceCenterId: serviceCenter.id } })
      const oldCategoryIdList = oldServiceCenterCategoryList.map(item => item.categoryId);
      const deletedCategoryIdList = oldCategoryIdList.filter(categoryId => !data.categoryIdList.includes(categoryId));
      const newCategoryIdList = data.categoryIdList.filter(categoryId => !oldCategoryIdList.includes(categoryId));
      await ServiceCenterCategory.destroy({ where: { categoryId: deletedCategoryIdList, serviceCenterId: serviceCenter.id } });
      await ServiceCenterCategory.bulkCreate(newCategoryIdList.map(categoryId => {
        return {
          categoryId, 
          serviceCenterId: serviceCenter.id
        }
      }));
    } catch (e) {
      throw new Error(`Помилка при оновленні категорій сервісного центру. ${e.message}`)
    }
  }

  const { mainPhoto, ...photos } = files;

  await Photo.destroy({ where: { serviceCenterId: serviceCenter.id } });
  if (Object.values(photos).length > 0) {
    try {
      await Photo.bulkCreate(Object.values(photos).map(photo => {
        return {
          photo: photo.data, 
          serviceCenterId: serviceCenter.id
        }
      }));
    } catch (e) {
      throw new Error(`Помилка при оновленні фото сервісного центру. ${e.message}`)
    }
  }

  serviceCenter = await getServiceCenterQuery("id", serviceCenter.id);

  await DbHelper.closeConnection();

  return serviceCenter;
}

const listServiceCenter = async (filterMap) => {
  await DbHelper.createConnection();
 
  const sequelize = DbHelper.getSequalize();

  const [serviceCenterList, ] = await sequelize.query(`SELECT serviceCenter.*, responses.rating, city.name AS "cityName", categories."categoryNameArray", categories."categoryIdArray" FROM public."serviceCenters" AS serviceCenter
    INNER JOIN public."cities" AS city ON serviceCenter."cityId" = city.id
    INNER JOIN (
      SELECT serviceCenterCategory."serviceCenterId", array_agg(category.name) AS "categoryNameArray", array_agg(category.id) AS "categoryIdArray"
      FROM public."serviceCenterCategories" AS serviceCenterCategory
      INNER JOIN public.categories AS category ON category.id = serviceCenterCategory."categoryId"
      GROUP BY serviceCenterCategory."serviceCenterId"
    ) categories ON categories."serviceCenterId" = serviceCenter.id
    LEFT JOIN (
      SELECT response."serviceCenterId", avg(response.rating) AS "rating"
      FROM public."responses" AS response
      GROUP BY response."serviceCenterId"
    ) responses ON responses."serviceCenterId" = serviceCenter.id`);

  await DbHelper.closeConnection();

  serviceCenterList.forEach(serviceCenter => {
    if (serviceCenter.mainPhoto) {
      serviceCenter.mainPhoto = serviceCenter.mainPhoto.toString("base64");
    }
  });

  return {
    serviceCenterList
  };
}

const deleteServiceCenter = async (user) => {
  await DbHelper.createConnection();
 
  const serviceCenter = await ServiceCenter.findOne({where: { administratorId: user.id }});
  
  if (!serviceCenter) {
    throw new Error("Сервісний центр не знайдено.");
  }

  const applicationList = await Application.findAll({ where: { serviceCenterId: serviceCenter.id } });
  const orderList = await Order.findAll({ where: { serviceCenterId: serviceCenter.id } });
  const taskList = await Task.findAll({ where: { serviceCenterId: serviceCenter.id } });

  const statusIdList = [ ...orderList.map(order => order.statusId), ...taskList.map(task => task.statusId) ];
  const clientContactsIdList = [ ...orderList.map(order => order.statusId), ...applicationList.map(application => application.clientContactsId) ];
  const objectDataIdList = [ ...orderList.map(order => order.statusId), ...applicationList.map(application => application.objectDataId) ];

  statusIdList.forEach(async statusId => {
    try {
      await Status.destroy({ where: {id: statusId} });
    } catch (error) {
      throw new Error(`Помилка при видаленні статусу. ${error.message}`);
    }
  });

  clientContactsIdList.forEach(async clientContactsId => {
    try {
      await ClientContacts.destroy({ where: {id: clientContactsId} });
    } catch (error) {
      throw new Error(`Помилка при видаленні контактів клієнта. ${error.message}`);
    }
  });

  objectDataIdList.forEach(async objectDataId => {
    try {
      await ObjectData.destroy({ where: {id: objectDataId} });
    } catch (error) {
      throw new Error(`Помилка при видаленні даних об'єкту. ${error.message}`);
    }
  });

  try {
    await Application.destroy({ where: { id: serviceCenter.id } });
    await Order.destroy({ where: { id: serviceCenter.id } });
    await Task.destroy({ where: { id: serviceCenter.id } });
    await Employee.destroy({ where: { id: serviceCenter.id } });
    await ServiceCenter.destroy({ where: { id: serviceCenter.id } });
  } catch (error) {
    throw new Error(`Помилка при видаленні сервісного центру. ${error.message}`);
  }

  await DbHelper.closeConnection();
}

module.exports = {
  getServiceCenter,
  getServiceCenterManagement,
  getServiceCenterAdministratorData,
  createServiceCenter,
  updateServiceCenter,
  listServiceCenter,
  deleteServiceCenter
};