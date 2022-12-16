const { promotion } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const { fileController } = require('../filesControllers');
const getImagePath = require('../../utils/helpers/get-image-path');

/**
 * It deletes a promotion from the database and deletes the image associated with it.
 * @param req - The request object.
 * @param res - the response object
 * @returns a message notifying the promotion's deletion if successfull, else an error message describing
 * the error.
 */
const destroy = async (req, res) => {
  const promotionId = req.params.promotionId;
  try {
    const promotion = await Promotion.findByPk(promotionId);
    if (typeof promotion === 'undefined' || promotion === null)
      return responses.errorDTOResponse(res, 404, 'Promocion no encontrada');

    const { img: fileurl } = promotion;
    await promotion.destroy({
      where: { id: promotionId }
    });
    if (typeof fileurl !== 'undefined' && fileurl !== null)
      fileController.deleteFile(getImagePath(fileurl), fileurl.split('/')[5]);
    return responses.successDTOResponse(res, 200, 'Promocion eliminada con exito');
  } catch (error) {
    return responses.errorDTOResponse(res, 400, error.message);
  }
}

const deleter = {
  destroy
}

module.exports = deleter;