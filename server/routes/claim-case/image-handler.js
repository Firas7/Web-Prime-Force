const service = require('../../database-service/claim-case.service');
const logger = require('../../logger');
const imagehandler = require('../../controller/image.controller');

async function uploadImage(request) {
  //logger.debug('uploadImage handler(' + request.payload.file + ')');
  //logger.info('upload file: ' + request.payload.file != null);
  const imageId = await imagehandler.uploadImage(request.payload.file);
  if (request.payload.tags != null) {
    imageId['tags'] = request.payload.tags;
  } else {
    imageId['tags'] = [];
  }

  //safe to claim-case
  return await service.addImageId(request.params.id, imageId);
}

async function getImage(request, res) {
  logger.debug('getImage handler(' + request.params.imageid + ')');
  return await imagehandler.getImage(request.params.imageid, res);
}
async function deleteImage(request) {
  logger.debug('delete handler(' + request.payload + ')');
  await imagehandler.deleteImages(request.payload);
  return await service.deleteImage(request.params.id, request.payload).value
    .images;
}

module.exports = {
  uploadImage: uploadImage,
  getImage: getImage,
  deleteImage: deleteImage,
};
