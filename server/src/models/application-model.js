const { Sequelize, DataTypes } = require("sequelize");
const ObjectData = require('./object-data-model');
const ServiceCenter = require('./service-center-model');
const ClientContacts = require('./client-contacts-model');
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Application = sequelize.define("application", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dateTimeCreated: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('considered', 'accepted', 'refused'),
    defaultValue: "considered",
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
});

ObjectData.hasOne(Application, {
  foreignKey: {
    name: "objectDataId",
    allowNull: false,
    unique: true
  }
});

ServiceCenter.hasOne(Application, {
  foreignKey: {
    name: "serviceCenterId",
    allowNull: false,
  }
});

ClientContacts.hasOne(Application, {
  foreignKey: {
    name: "clientContactsId",
    allowNull: false,
    unique: true
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Application;