const { Op } = require('sequelize');
const { Warehouse, Sticker, Team, Game, PlayersGame } = require('../../databases/db');
const responses = require('../../utils/responses/responses');


/**
 * Find receives a page number and a page size. It gets the user's paginated bench from their warehouse 
 * and returns the paginated result.
 * @param req - the request object
 * @param res - the response object
 */
const find = async (req, res) => {
  try {
    let { page = 0, size = 10, playername: playerName = '.*', teamname = '%', position = ['goalkeeper', 'defender', 'forward', 'midfielder'] } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    const userId = req.user.id.id;
    const eventId = req.eventId;
    let options = {
      attributes: { 
        exclude: ['id', 'stickerId', 'userId', 'eventId','createdAt', 'updatedAt']
      },
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber,
      where: {
        userId,
        eventId,
        quantity: { [Op.ne]: 0 }
      },
      order : [
        ['isInLineup', 'DESC']
      ],
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
          model: Team,
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
    const items = [];
    for (let i = 0; i < rows.length; i++) {
      let warehouse = rows[i].sticker.toJSON();
      warehouse.isInLineup = rows[i].isInLineup;
      let playersGame = await PlayersGame.findOne({
        where: {
          playerId: rows[i].sticker.id
        },
        attributes: ['points'],
        include: {
          model: Game,
          attributes: []
        },
        order: [ [Game, 'gameDate', 'DESC'] ]
      });
      warehouse.latestPoints = playersGame?.points || 0;
      items.push(warehouse);
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

