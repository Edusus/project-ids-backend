const { Op } = require('sequelize');
const { Warehouse, Sticker, team } = require('../../databases/db');
const sticker = require('../../models/sticker');
const warehouses = require('../../models/warehouses');
const responses = require('../../utils/responses/responses');


/**
 * Find receives a page number and a page size. It gets the user's paginated bench from their warehouse 
 * and returns the paginated result.
 * @param req - the request object
 * @param res - the response object
 */
const find = async (req, res) => {
  try {
    let { page = 0, size = 10, playername: playerName = '.*', teamname = '%', position = ['arquero', 'defensa', 'delantero', 'medio campo'] } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    const userId = req.user.id.id;
    const eventId = req.eventId;
    let options = {
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber,
      where: {
        userId,
        eventId,
        isInLineup: false
      },
      include: {
        model: Sticker,
        attributes: ['id', 'playerName', 'position', 'img', 'createdAt', 'updatedAt'],
        where: {
          playerName: {
            [Op.regexp]: playerName
          },
          position
        },
        include: {
          model: team,
          attributes: ['id', 'name', 'badge'],
          where: {
            name: {
              [Op.like]: teamname
            }
          }
        }
      }
    }
    const { count, rows } = await Warehouse.findAndCountAll(options);

    const warehouses = JSON.parse(JSON.stringify(rows));
    const items = [];
    for (let i = 0; i < warehouses.length; i++) {
      items.push(warehouses[i].sticker);
    }

    responses.paginatedDTOsResponse(res, 200, 'Almacen recuperado con exito', items, count, pageAsNumber, sizeAsNumber);
  } catch(err) {
    console.log(err);
    responses.errorDTOResponse(res, 400, err.message);
  }
}

const finder = {
  find
}

module.exports = finder;

