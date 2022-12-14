const { Op } = require('sequelize');
const { Promotion } = require('../../databases/db');
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

const finder = {
  find,
  findById,
  findAll
}

module.exports = finder;