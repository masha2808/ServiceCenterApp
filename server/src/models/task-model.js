const { DataTypes } = require("sequelize");
const Order = require('./order-model');
const Status = require('./status-model');
const Employee = require('./employee-model');
const ServiceCenter = require('./service-center-model');
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Task = sequelize.define("task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
});

Order.hasOne(Task, {
  foreignKey: {
    name: "orderId",
    allowNull: true,
  }
});

Status.hasOne(Task, {
  foreignKey: {
    name: "statusId",
    allowNull: false,
  }
});

Employee.hasOne(Task, {
  foreignKey: {
    name: "employeeId",
    allowNull: false,
  }
});

ServiceCenter.hasOne(Task, {
  foreignKey: {
    name: "serviceCenterId",
    allowNull: false,
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Task;