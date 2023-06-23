const { DataTypes } = require("sequelize");
const User = require('./user-model');
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const ClientContacts = sequelize.define("clientContacts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  middleName: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryToServiceCenter: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  deliveryFromServiceCenter: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

User.hasOne(ClientContacts, {
  foreignKey: {
    name: "clientId",
    allowNull: true,
    unique: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = ClientContacts;