const { DataTypes } = require("sequelize");
const User = require("./user-model");
const City = require("./city-model");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const ServiceCenter = sequelize.define("serviceCenter", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mapLatitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  mapLongitude: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  mainPhoto: {
    type: DataTypes.BLOB,
    allowNull: true
  },
});

User.hasOne(ServiceCenter, {
  foreignKey: {
    name: "administratorId",
    allowNull: false,
    unique: true
  }
});

City.hasOne(ServiceCenter, {
  foreignKey: {
    name: 'cityId',
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = ServiceCenter;