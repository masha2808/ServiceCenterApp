const { Sequelize, DataTypes } = require("sequelize");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Status = sequelize.define('status', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.ENUM('created', 'inProgress', 'completed', 'problem', 'canceled'),
    defaultValue: "created",
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dateTimeCreated: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  plannedDateCompleted: {
    type: 'TIMESTAMP',
    allowNull: true
  },
  dateCompleted: {
    type: 'TIMESTAMP',
    allowNull: true
  }
});

(async () => {
  await sequelize.sync({ alter: true });
})();

module.exports = Status;