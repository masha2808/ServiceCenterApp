const { DataTypes } = require("sequelize");
const Category = require("./category-model");
const ServiceCenter = require("./service-center-model");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const ServiceCenterCategory = sequelize.define("serviceCenterCategory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
});

Category.hasOne(ServiceCenterCategory, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false
  }
});

ServiceCenter.hasOne(ServiceCenterCategory, {
  foreignKey: {
    name: 'serviceCenterId',
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = ServiceCenterCategory;