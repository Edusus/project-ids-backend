const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { csv_dir } = require('./fileManager');
const mimetypes = ['text/csv'];

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, csv_dir);
  },
  filename: (req, file, cb) => {
    let { name, ext } = path.parse(file.originalname);
    if (!ext || ext == '')
      ext = file.mimetype.split('/')[1]; 
    cb(null, name.replaceAll(' ', '-') + '-' + uuidv4() + ext);
  }
});

const csvUploader = multer({
  storage: csvStorage,
  fileFilter: (req, file, cb) => {
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
  limits: {
    fieldSize: 15000000,
    fileSize: 10000000
  }
});

const uploadCsv = csvUploader.single('myFile');

module.exports = {
  uploadCsv
}