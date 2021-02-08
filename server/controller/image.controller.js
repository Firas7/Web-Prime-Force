const gridfs = require('../database-service/collection-service').gfs;
const logger = require('../logger');
const Boom = require('@hapi/boom');
const stream = require('stream');
const mongo = require('mongodb');
const sharp = require('sharp');

/** @module controller/image */

//https://github.com/aheckmann/gridfs-stream
/**
 *
 *
 * @param {*} file
 * @returns imageId
 */
async function uploadImage(file) {
  const filename = file.hapi.filename;
  const data = file._data;
  let imageId = {
    small: 150,
    sd: 720,
    hd: 1280,
    fullHd: 1920,
  };
  const gfs = gridfs();
  for (const key in imageId) {
    const resolution = imageId[key];
    const buffer = await sharp(data).resize(resolution).toBuffer();

    //logger.info('upload' + resolution + ' ==> ' + buffer.length);
    imageId[key] = await safeImage(buffer, resolution, filename, gfs);
  }
  logger.info('upload ' + JSON.stringify(imageId));
  return imageId;
}

/**
 *
 *
 * @param {*} image
 * @param {*} resolution
 * @param {*} filename
 * @param {*} gfs
 * @returns stream
 */
async function safeImage(image, resolution, filename, gfs) {
  const promise = new Promise((resolve, reject) => {
    const writeStream = gfs.createWriteStream({
      filename: filename,
      metadata: resolution,
    });
    var s = new stream.Readable();
    s.push(image);
    s.push(null); // Push null to end stream
    s.pipe(writeStream);

    writeStream.on('close', () => {
      resolve(writeStream.id);
    });
    writeStream.on('finish', () => {
      resolve(writeStream.id);
    });
    writeStream.on('error', () => {
      logger.error('file NOT saved' + filename);
      reject(Boom.badRequest('UPLOAD_FILE_FAILED'));
    });
  });
  return promise;
}

/**
 *
 *
 * @param {*} id
 * @returns stream
 */
function getImage(id) {
  const promise = new Promise((resolve, reject) => {
    const object_id = new mongo.ObjectID(id);
    const gfs = gridfs();
    const readStream = gfs.createReadStream({ _id: object_id });
    let data = '';
    readStream.setEncoding('base64');

    // Handle stream events --> data, end,
    readStream.on('data', function (chunk) {
      logger.debug('get file chunk' + id);
      data += chunk;
    });
    readStream.on('end', function () {
      logger.info('get file' + id);
      resolve(data);
    });
    readStream.on('finish', () => {
      logger.info('get file' + id);
      resolve(data);
    });
    readStream.on('error', () => {
      logger.error('get file error' + id);
      reject(Boom.badRequest('GET_FILE_FAILED'));
    });
  });
  return promise;
}

/**
 *
 *
 * @param {*} imageId
 * @returns imageId
 */
async function deleteImages(imageId) {
  const gfs = gridfs();
  for (const key in imageId) {
    const fileId = imageId[key];
    logger.info('DELETE FILE BEGIN' + fileId);
    gfs.remove({ _id: fileId }, function (err) {
      if (err) {
        logger.error('DELETE FILE ERROR' + fileId);
      } else {
        logger.info('DELETE FILE END' + fileId);
      }
    });
  }
  return imageId;
}
module.exports = {
  getImage: getImage,
  uploadImage: uploadImage,
  deleteImages: deleteImages,
};
