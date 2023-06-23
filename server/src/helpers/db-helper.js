require('dotenv').config();
const { Sequelize } = require('sequelize');

const getSequalize = () => {
  console.log(process.env.DB_USERNAME)
  console.log(process.env.DB_PASSWORD)
  return new Sequelize(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost:${process.env.DB_PORT}/ServiceCenterApp`);
}

const createConnection = async () => {
  const sequelize = getSequalize();
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const closeConnection = async () => {
  const sequelize = getSequalize();
  sequelize.close();
}

module.exports = { getSequalize, createConnection, closeConnection };