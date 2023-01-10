const { imgController } = require('../../controllers/filesControllers');
const path = require('path');

const img_relative_dir = '/' + imgController.img_relative_dir.replace('\\', '/');

/**
 * It takes an image URL and returns the filepath of the image
 * @param imageUrl the url of the image
 * @returns the image path.
 */
function getImagePath(imageUrl) {
  const imageFilepath = imageUrl.split(img_relative_dir)[1];
  return path.join(imgController.img_dir, imageFilepath);
}

module.exports = getImagePath;