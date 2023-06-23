const { DataTypes } = require("sequelize");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Credentials = sequelize.define('credentials', {
  email: {
    type: DataTypes.TEXT,
    primaryKey: true,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Credentials;