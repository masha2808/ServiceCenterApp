const photoService = require('./../services/photo-service');

const listPhotosByServiceCenterId = async (req, res) => {
  try {
    const photos = await photoService.listPhotosByServiceCenterId(req.params.id);
    res.status(200).send(photos);
  } catch (error) {
    res.status(400).send({
      "message": error.message
    });
  }
}

module.exports = {
  listPhotosByServiceCenterId
};
