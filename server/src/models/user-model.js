const { DataTypes } = require("sequelize");
const Credentials = require("./credentials-model");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.ENUM('client', 'administrator', 'employee'),
    allowNull: false,
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
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  phone: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photo: {
    type: DataTypes.BLOB,
    allowNull: true
  },
});

Credentials.hasOne(User, { 
  foreignKey: {
    name: 'email',
    unique: true,
    allowNull: false
  } 
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = User;