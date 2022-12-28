const { uploadImg } = require('./files/imgUploader');
const { uploadCsv } = require('./files/csvUploader');
const { deleteFile, uploads_relative_dir, img_relative_dir, csv_relative_dir,
  uploads_dir, img_dir, csv_dir } = require('./files/fileManager');

const imgController = {
  uploadImg,
  img_dir,
  img_relative_dir
}

const csvController = {
  uploadCsv,
  csv_dir,
  csv_relative_dir
}

const fileController = {
  deleteFile
}

module.exports = { 
  imgController, fileController, csvController, uploads_dir, uploads_relative_dir
}