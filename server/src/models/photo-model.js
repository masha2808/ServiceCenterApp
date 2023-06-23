const { DataTypes } = require("sequelize");
const ServiceCenter = require("./service-center-model");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Photo = sequelize.define('photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  photo: {
    type: DataTypes.BLOB,
    allowNull: false
  },
});

ServiceCenter.hasOne(Photo, {
  foreignKey: {
    name: 'serviceCenterId',
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Photo;