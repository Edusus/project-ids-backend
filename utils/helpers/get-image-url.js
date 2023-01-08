const { imgController } = require('../../controllers/filesControllers');

/**
 * It takes an image name and returns the image's URL.
 * @param imageName - the name of the image file
 * @returns The image url.
 */
function getImageUrl(imageName) {
  const img_relative_dir = '/' + imgController.img_relative_dir.replace('\\', '/') + '/';
  return `${process.env.DOMAIN}${img_relative_dir}${imageName}`;
}

module.exports = getImageUrl;

