const { pdfController } = require('../../controllers/filesControllers');
const path = require('path');

const pdf_relative_dir = '/' + pdfController.pdf_relative_dir.replace('\\', '/');


function getPDFPath(pdfUrl) {
  const pdfFilePath = pdfUrl.split(pdf_relative_dir)[1];
  return path.join(pdfController.pdf_dir, pdfFilePath);
}

module.exports = getPDFPath;