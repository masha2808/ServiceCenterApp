const { DataTypes } = require("sequelize");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const ObjectData = sequelize.define("objectData", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  objectType: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  model: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = ObjectData;