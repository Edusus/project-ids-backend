const path = require('path');
const fse = require('fs-extra');

const current_dir = path.dirname(__filename);
const root_dir = path.join(current_dir, '..', '..');
const uploads_dir = path.join(root_dir, 'uploads');
const uploads_relative_dir = path.relative(root_dir, uploads_dir);
const img_dir = path.join(uploads_dir, 'img');
const img_relative_dir = path.relative(root_dir, img_dir);
const pdf_dir = path.join(uploads_dir, 'pdf');
const pdf_relative_dir = path.relative(root_dir, pdf_dir);
const csv_dir = path.join(uploads_dir, 'csv');
const csv_relative_dir = path.relative(root_dir, csv_dir);

/* Creating a directory called uploads in the root directory of the project. */
fse.ensureDir(uploads_dir)
.then(() => {
  console.log("uploads created!");
})
.catch((err) => {
  console.error(err);
});

fse.ensureDir(img_dir)
.then(() => {
  console.log("uploads/img created!");
})
.catch(err => {
  console.error(err);
});

fse.ensureDir(pdf_dir)
.then(() => {
  console.log("uploads/pdf created!");
})
.catch(err => {
  console.error(err);
});

fse.ensureDir(csv_dir)
.then(() => {
  console.log("uploads/csv created!");
})
.catch(err => {
  console.error(err);
});

const deleteFile = async (path, filename) => {
  try {
    await fse.remove(path);
    console.log(`${filename} file deleted!`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  deleteFile, uploads_relative_dir, img_relative_dir, csv_relative_dir,
  uploads_dir, img_dir, csv_dir, pdf_dir, pdf_relative_dir
}