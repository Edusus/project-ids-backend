const { Promotion } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const { fileController } = require('../filesControllers');
const getImagePath = require('../../utils/helpers/get-image-path');
const getImageUrl = require('../../utils/helpers/get-image-url');

const allowedFields = ['alias', 'promotionType', 'redirecTo', 'img', 'description'];
const mimetypes = ['image/jpeg', 'image/png'];

/**
 * It updates a promotion in the database, and if the update is successful, it deletes the previous
 * image from the server and uploads the new one.
 * @param req - the request object
 * @param res - the response object
 * @returns if successfull, a message indicating the promotion's been updated, else an error
 * message describing the error.
 */
const update = async (req, res) => {
  const promotionId = req.params.promotionId;
  try {
    const promotion = await Promotion.findByPk(promotionId);
    if (typeof promotion === 'undefined' || promotion === null)
      return responses.errorDTOResponse(res, 404, 'Promocion no encontrada');
    
    const { img: prevImgUrl } = promotion;
    const { alias, promotionType, redirecTo, description = null } = req.body;
    let lowPromotionType = undefined;  //promotionType, si no recibe nada, es undefined
    if (typeof promotionType !== 'undefined' && promotionType !== null)
      lowPromotionType = promotionType.toLowerCase();
    let imageUrl = undefined;
    if (Object.hasOwn(req, 'file'))
      imageUrl = getImageUrl(req.file.filename);
    await promotion.update({
      'alias': alias,
      'promotionType': lowPromotionType,
      'redirecTo': redirecTo,
      'img': imageUrl,
      'description': description
    }, {
      where: { id: promotionId }, 
      fields: allowedFields 
    });
    if (typeof imageUrl !== 'undefined' && imageUrl !== null)
      fileController.deleteFile(getImagePath(prevImgUrl), prevImgUrl.split('/')[5]);
    return responses.successDTOResponse(res, 200, 'Promocion actualizada con exito');
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined')
      fileController.deleteFile(req.file.path, req.file.filename);      
    return responses.errorDTOResponse(res, 400, error.message);
  }
}

const updater = {
  update
}

module.exports = updater;