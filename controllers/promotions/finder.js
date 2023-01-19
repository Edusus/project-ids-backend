const { Op } = require('sequelize');
const { Promotion, random } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const generatePromotionReport = require('./generate-promotion-report');

/**
 * Find all promotions and return them in a response object
 * @param req - The request object.
 * @param res - The response object
 * @returns the response of the function findAll.
 */
const exportReportPDF = async (req, res) => {
  const promotion = await Promotion.findByPk(req.params.promotionId);
  if (!promotion) return res.status(404).text('Promocion no encontrada');

  const pdfStream = await generatePromotionReport(promotion);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report-promotion.pdf');
  // send a status code of 200 OK
  res.statusCode = 200             
  // once we are done reading end the response
  pdfStream.on('end', () => {
    // done reading
    return res.end()
  })
  // pipe the contents of the PDF directly to the response
  pdfStream.pipe(res);
}

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

const findOneToWatch = async (req, res) => {
  const promotion = await Promotion.findOne({ order: random });

  if(typeof promotion === 'undefined' || promotion == null)
    return responses.errorDTOResponse(res, 500, "No hay promociones que mostrar actualmente");

  await promotion.increment('requestedQuantities');
  await promotion.reload();

  return responses.singleDTOResponse(res, 200, 'Promocion recuperada con exito', promotion);
}

const findAndRedirectById = async (req, res) => {
  const promotion = await Promotion.findByPk(req.params.promotionId);

  if(typeof promotion === 'undefined' || promotion == null)
    return responses.errorDTOResponse(res, 404, "Promocion no encontrada");

  await promotion.increment('clickedQuantities');
  await promotion.reload();

  return res.redirect(302, promotion.redirecTo);
}

const finder = {
  find,
  findById,
  findAll,
  exportReportPDF,
  findOneToWatch,
  findAndRedirectById
}

module.exports = finder;