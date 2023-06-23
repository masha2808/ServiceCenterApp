const { DataTypes } = require("sequelize");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const City = sequelize.define("city", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = City;