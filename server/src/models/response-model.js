const { DataTypes } = require("sequelize");
const User = require("./user-model");
const ServiceCenter = require("./service-center-model");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Response = sequelize.define('response', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
});

User.hasOne(Response, {
  foreignKey: {
    name: 'clientId',
    allowNull: false
  }
});

ServiceCenter.hasOne(Response, {
  foreignKey: {
    name: 'serviceCenterId',
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Response;