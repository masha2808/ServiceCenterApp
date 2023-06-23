const { DataTypes } = require("sequelize");
const User = require("./user-model");
const ServiceCenter = require("./service-center-model");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Employee = sequelize.define('employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  position: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cooperationStartDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cooperationEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
});

User.hasOne(Employee, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
    unique: true
  }
});

ServiceCenter.hasOne(Employee, {
  foreignKey: {
    name: 'serviceCenterId',
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Employee;