const { Op } = require('sequelize');
const { game, PlayersGame, team, Sticker } = require('../../databases/db');

/**
 * If the resource is found, send a 200 status code with the resource in the response body. If the
 * resource is not found, send a 404 status code with a message in the response body.
 * @param res - the response object
 * @param resource - the resource that was found
 * @param resourceName - The name of the resource you're trying to get.
 */
 const httpGetResponse = (res, resource, resourceName) => {
  if (resource.item || resource.items) {
    res.status(200).json(resource);
  } else {
    res.status(404).json({
      "success": false,
      "message": resourceName + ' not found'
    });
  }
}

const find = async (req, res) => {
  try {
    let { page = 0, size = 10, teamOne = '.*', teamTwo = '.*', eventid = '%' } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    let options = {
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber,
      attributes: ['id', 'matchedAt', 'eventId'],
      where: {
        eventId: { 
          [Op.like]: eventid 
        }
      },
      include: [
        {
          model: PlayersGame,
          attributes: ['playerId', 'points']
        },
        {
          model: team,
          as: 'teamOne',
          where: {
            name: {
              [Op.or]: {
                [Op.regexp]: teamOne,
                [Op.regexp]: teamTwo
              }
            }
          }
        },
        {
          model: team,
          as: 'teamTwo',
          where: {
            name: {
              [Op.or]: {
                [Op.regexp]: teamOne,
                [Op.regexp]: teamTwo
              }
            }
          }
        }
      ]
    }
    const games = await game.findAll(options);
    for (let i = 0; i < games.length; i++) {
      let Game = games[i];
      console.log(JSON.parse(JSON.stringify(Game)));
      console.log(await Game.getTeamOne());
      console.log(await Game.getTeamTwo());
    }
    httpGetResponse(
      res, {
        success: true,
        message: 'Partidos recuperados con exito',
        paginate: {
          //total: games.count,
          page: pageAsNumber,
          //pages: Math.trunc(games.count/sizeAsNumber),
          perPage: sizeAsNumber
        },
        items: games
      }, 'games');
  } catch(err) {
    console.error(err);
    res.status(400).send(err.message);
  }
}

const findById = async (req, res) => {
  const Game = await game.findByPk(req.params.gameId, {
    include: [
      {
        model: PlayersGame
      },
      {
        model: team,
        as: 'teamOne'
      },
      {
        model: team,
        as: 'teamTwo'
      },
      {
        model: Sticker,
        as: 'players'
      }
    ]
  });
  console.log(JSON.parse(JSON.stringify((await Game.getTeamTwo({attributes: ['name', 'badge', 'idEvents']})))));
  httpGetResponse(res, {
    success: true,
    message: 'Partido recuperado con exito',
    item: Game
  }, "game");
}

const findAll = async (req, res) => {
  const games = await game.findAll({
    include: [
      {
        model: PlayersGame
      },
      {
        model: team,
        as: 'teamOne'
      },
      {
        model: team,
        as: 'teamTwo'
      },
      {
        model: Sticker,
        as: 'players'
      }
    ]
  });
  httpGetResponse(res, {
    success: true,
    message: 'Partidos recuperados con exito',
    items: games
  }, "games");
}

const finder = {
  find,
  findById,
  findAll
}

module.exports = finder;