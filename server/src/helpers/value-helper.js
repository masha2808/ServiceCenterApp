const crypto = require("crypto");

const getRandomNumber = () => {
  return (Math.random() + 1).toString(10).substring(10, 14);
}

const generateNumber = () => {
  return `${getRandomNumber()}-${getRandomNumber()}-${getRandomNumber()}-${getRandomNumber()}`
}

module.exports = {
  generateNumber,
}