const bcrypt = require('bcrypt');

const Photo = require('../models/photo-model');

const DbHelper = require('../helpers/db-helper');

const listPhotosByServiceCenterId = async (serviceCenterId) => {
  await DbHelper.createConnection();
  
  const photoList = await Photo.findAll({ where: { serviceCenterId } })

  await DbHelper.closeConnection();

  photoList.forEach(photoItem => {
    photoItem.photo = photoItem.photo.toString("base64");
  });

  return { photoList };
}

module.exports = {
  listPhotosByServiceCenterId
};