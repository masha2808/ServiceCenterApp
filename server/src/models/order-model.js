const { DataTypes } = require("sequelize");
const Status = require('./status-model');
const ObjectData = require('./object-data-model');
const Application = require('./application-model');
const ServiceCenter = require('./service-center-model');
const ClientContacts = require('./client-contacts-model');
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  payed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true
  },
});

Status.hasOne(Order, {
  foreignKey: {
    name: "statusId",
    allowNull: false,
  }
});

ObjectData.hasOne(Order, {
  foreignKey: {
    name: "objectDataId",
    allowNull: false,
    unique: true
  }
});

Application.hasOne(Order, {
  foreignKey: {
    name: "applicationId",
    allowNull: true,
  }
});

ServiceCenter.hasOne(Order, {
  foreignKey: {
    name: "serviceCenterId",
    allowNull: false,
  }
});

ClientContacts.hasOne(Order, {
  foreignKey: {
    name: "clientContactsId",
    allowNull: true,
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Order;