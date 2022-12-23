const { Op } = require('sequelize');
const { Promotion, random } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

/**
 * Find all promotions and return them in a response object
 * @param req - The request object.
 * @param res - The response object
 * @returns the response of the function findAll.
 */
const findAll = async (req, res) => {
  const promotions = await Promotion.findAll();
  return responses.multipleDTOsResponse(res, 200, 'Promociones recuperadas con exito', promotions);
}

/**
 * It finds a promotion by its id and returns it if it exists, otherwise it returns an error message.
 * @param req - The request object.
 * @param res - The response object
 * @returns the response of the function findByPk.
 */
const findById = async (req, res) => {
  const promotion = await Promotion.findByPk(req.params.promotionId);
  if (promotion)
    return responses.singleDTOResponse(res, 200, 'Promocion recuperada con exito', promotion);

  return responses.errorDTOResponse(res, 404, 'Promocion no encontrada');
}

/**
 * It returns a paginated list of promotions, filtered by alias and promotion type.
 * @param req - the request object
 * @param res - the response object
 * @returns the response of the function findAndCountAll.
 */
const find = async (req, res) => {
  try {
    let { page = 0, size = 10, alias: ann = '.*', promotiontype: type = ['static', 'popup'] } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    let options = {
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber, 
      where: {
        alias: {
          [Op.regexp]: ann
        },
        promotionType: type
      },
    };
    const { count, rows } = await Promotion.findAndCountAll(options);
    return responses.paginatedDTOsResponse(res, 200, 'Promociones recuperadas con exito', rows, count,
    pageAsNumber, sizeAsNumber);
  } catch (error) {
    console.error(error);
    return responses.errorDTOResponse(res, 400, error.message);
  }
}

const watch = async (req, res) =>  {
    const encontro = await Promotion.findOne();
    console.log(encontro);
  try {
    if (await Promotion.findOne()) {
      const cont = 1;
      const singleAd = await Promotion.findOne({ order: random});
      let valorActual = singleAd.dataValues.requestedQuantities;
      let valorNuevo = valorActual + cont;
      singleAd.update({ requestedQuantities: valorNuevo });
      return res.status(200).json({ success: true, data: singleAd });
    } else {
      return res.status(404).json({ success: false, message: "No hay anuncios disponibles" });
    }
  } catch (error) {
    console.error(error)
    return responses.errorDTOResponse(res, 400, error.message);
  }
}

const watch_detailed = async (req, res) =>  {  
  try {
    if (await findPromotionById(req.params.promotionId)) {
      const reqAd = await findPromotionById(req.params.promotionId);
      const cont = 1;
      let valorActual = reqAd.dataValues.clickedQuantities;
      let valorNuevo = valorActual + cont;
      reqAd.update({ clickedQuantities: valorNuevo });
      let URL = reqAd.dataValues.redirecTo;
      return res.redirect(302, URL);
   } else {
      return res.status(404).json({ success: false, message: "No hay anuncios disponibles" });
   }
  } catch (error) {
    console.error(error);
    return responses.errorDTOResponse(res, 500, error.message);
  }
}

const finder = {
  find,
  findById,
  findAll,
  watch,
  watch_detailed
}

module.exports = finder;