const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fse = require('fs-extra');

const current_dir = path.dirname(__filename);
const uploads_dir = path.join(current_dir, '..', '..', 'uploads');
const mimetypes = ['image/jpeg', 'image/png'];

fse.ensureDir(uploads_dir)
.then(() => {
  console.log("uploads created!");
})
.catch((err) => {
  console.error(err);
});

const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploads_dir);
  },
  filename: (req, file, cb) => {
    let { name, ext } = path.parse(file.originalname);
    if (!ext || ext == '')
      ext = file.mimetype.split('/')[1]; 
    cb(null, name + '-' + uuidv4() + ext);
  }
});

const imgUploader = multer({
  storage: imgStorage,
  fileFilter: (req, file, cb) => {
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Solo se aceptan archivos de tipo ' + mimetypes.join(', ')));
  },
  limits: {
    fieldSize: 15000000,
    fileSize: 10000000
  }
});

const uploadImg = imgUploader.single('myFile');

const deleteImg = async (path, filename) => {
  try {
    await fse.remove(path);
    console.log(`${filename} file deleted!`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  uploadImg, deleteImg, uploads_dir
};