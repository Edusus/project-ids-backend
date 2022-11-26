const { uploadImg, deleteImg, uploads_dir } = require('./img/uploader');

const imgController = {
  uploadImg,
  deleteImg,
  uploads_dir
}

module.exports = imgController;