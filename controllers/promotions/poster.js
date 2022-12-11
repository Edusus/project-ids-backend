const { promotion } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const { fileController } = require('../filesControllers');
const getImageUrl = require('../../utils/helpers/get-image-url');

const allowedFields = ['alias', 'promotionType', 'redirecTo', 'img', 'description'];
const mimetypes = ['image/jpeg', 'image/png'];

/**
 * It creates a promotion in the database and returns a response with the created promotion.
 * @param req - the request object
 * @param res - the response object
 * @returns the response is the created promotion if successfull, else the response is an error message describing
 * why the promotion couldn't be created.
 */
const post = async (req, res) => {
  try {
    const { alias, promotionType, redirecTo, description = null } = req.body;
    const imageUrl = getImageUrl(req.file.filename);
    let lowPromotionType = undefined;  //promotionType, si no recibe nada, es undefined
    if (typeof promotionType !== 'undefined' && promotionType !== null)
      lowPromotionType = promotionType.toLowerCase();
    const Promotion = await promotion.create({
      'alias': alias,
      'promotionType': lowPromotionType,
      'redirecTo': redirecTo,
      'img': imageUrl,
      'description': description
    }, { fields: allowedFields });
    return responses.singleDTOResponse(res, 201, 'Promocion creada con exito', Promotion);
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      return responses.errorDTOResponse(res, 400, error.message);
    }

    return responses.errorDTOResponse(res, 409, 'No envió una imagen');
  }
}

const poster = {
  post
}

module.exports = poster;