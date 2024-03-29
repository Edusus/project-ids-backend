const { Op } = require('sequelize');
const { Game, PlayersGame, Team, Sticker, Event, GamePrize } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const minimunDate = new Date(0);

const find = async (req, res) => {
  try {
    const currentDate = new Date();
    let { page = 0, size = 10, teamone: teamOne = '.*', teamtwo: teamTwo = '.*', eventid = '%', fromgamedate = minimunDate, togamedate = currentDate, playername = '.*' } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    [fromgamedate, togamedate] = [new Date(Date.parse(fromgamedate)).setUTCHours(0,0,0,0), new Date(Date.parse(togamedate)).setUTCHours(23,59,59,999)];
    let countOptions = { 
      where: {
        eventId: { 
          [Op.like]: eventid 
        },
        gameDate: {
          [Op.between]: [fromgamedate, togamedate]
        }
      },
      include: [
        {
          model: Event
        },
        {
          model: Team,
          as: 'teamOne',
          where: {
            name: {
              [Op.or]: [{
                [Op.regexp]: teamOne },
                { [Op.regexp]: teamTwo
              }]
            }
          }
        },
        {
          model: Team,
          as: 'teamTwo',
          where: {
            name: {
              [Op.or]: [{
                [Op.regexp]: teamOne },
                { [Op.regexp]: teamTwo
              }]
            }
          }
        }
      ]
    }
    let searchOptions = {
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber,
      attributes: ['id', 'gameDate', 'eventId'],
      where: {
        eventId: { 
          [Op.like]: eventid 
        },
        gameDate: {
          [Op.between]: [fromgamedate, togamedate]
        }
      },
      include: [
        {
          model: Event,
          attributes: ['id', 'eventName', 'status']
        },
        {
          model: PlayersGame,
          attributes: ['playerId', 'points'],
          include: {
            model: Sticker,
            as: 'player',
            attributes: ['playerName', 'teamId'],
            where: {
              playerName: {
                [Op.regexp]: playername
              }
            }
          }
        },
        {
          model: Team,
          as: 'teamOne',
          attributes: ['id', 'name', 'badge'],
          where: {
            name: {
              [Op.or]: [
                {
                  [Op.regexp]: teamOne 
                },
                { 
                  [Op.regexp]: teamTwo
                }
              ]
            }
          }
        },
        {
          model: Team,
          as: 'teamTwo',
          attributes: ['id', 'name', 'badge'],
          where: {
            name: {
              [Op.or]: [ 
                {
                  [Op.regexp]: teamOne 
                },
                { 
                  [Op.regexp]: teamTwo
                }
              ]
            }
          }
        },
        {
          model: GamePrize,
          attributes: ['isAwarded']
        }
      ]
    }
    const count = await Game.count(countOptions);
    const games = await Game.findAll(searchOptions);

    const gamesAsJSON = JSON.parse(JSON.stringify(games));
    const items = [];
    for (let i = 0; i < gamesAsJSON.length; i++) {
      let players = gamesAsJSON[i].playersGames.map(playersGame => {
        return {
          playerId: playersGame.playerId,
          teamId: playersGame.player.teamId,
          fullName: playersGame.player.playerName,
          identifier: playersGame.playerId,
          points: playersGame.points
        }
      });
      let item = {
        id: gamesAsJSON[i].id,
        gameDate: gamesAsJSON[i].gameDate,
        event: gamesAsJSON[i].event,
        teamOne: gamesAsJSON[i].teamOne,
        teamTwo: gamesAsJSON[i].teamTwo,
        isAwarded: gamesAsJSON[i].gamePrize.isAwarded,
        players,
      }
      items.push(item);
    }

    responses.paginatedDTOsResponse(res, 200, 'Partidos recuperados con exito', items, count, pageAsNumber, sizeAsNumber);
  } catch(err) {
    console.error(err);
    responses.errorDTOResponse(res, 400, err.message);
  }
}

const findById = async (req, res) => {
  const game = await Game.findByPk(req.params.gameId, {
    attributes: ['id', 'gameDate', 'eventId'],
    include: [
      {
        model: Event,
        attributes: ['id', 'eventName', 'status']
      },
      {
        model: PlayersGame,
        attributes: ['playerId', 'points'],
        include: {
          model: Sticker,
          as: 'player',
          attributes: ['playerName', 'teamId']
        }
      },
      {
        model: Team,
        as: 'teamOne',
        attributes: ['id', 'name', 'badge']
      },
      {
        model: Team,
        as: 'teamTwo',
        attributes: ['id', 'name', 'badge']
      },
      {
        model: GamePrize,
        attributes: ['isAwarded']
      }
    ]
  });
  if (game) {
    const gameAsJSON = JSON.parse(JSON.stringify(game));
    let players = gameAsJSON.playersGames.map(playersGame => {
      return {
        playerId: playersGame.playerId,
        teamId: playersGame.player.teamId,
        fullName: playersGame.player.playerName,
        identifier: playersGame.playerId,
        points: playersGame.points
      }
    });
    const item = {
      id: gameAsJSON.id,
      gameDate: gameAsJSON.gameDate,
      event: gameAsJSON.event,
      teamOne: gameAsJSON.teamOne,
      teamTwo: gameAsJSON.teamTwo,
      isAwarded: gameAsJSON.gamePrize.isAwarded,
      players,
    }

    responses.singleDTOResponse(res, 200, 'Partido recuperado con exito', item);
    return;
  }

  responses.errorDTOResponse(res, 404, 'No se encontro el partido pedido');
}

const findAll = async (req, res) => {
  const games = await Game.findAll({
    attributes: ['id', 'gameDate', 'eventId'],
    include: [
      {
        model: Event,
        attributes: ['id', 'eventName', 'status']
      },
      {
        model: PlayersGame,
        attributes: ['playerId', 'points'],
        include: {
          model: Sticker,
          as: 'player',
          attributes: ['playerName', 'teamId']
        }
      },
      {
        model: Team,
        as: 'teamOne',
        attributes: ['id', 'name', 'badge']
      },
      {
        model: Team,
        as: 'teamTwo',
        attributes: ['id', 'name', 'badge']
      },
      {
        model: GamePrize,
        attributes: ['isAwarded']
      }
    ]
  });

  const gamesAsJSON = JSON.parse(JSON.stringify(games));
  const items = [];
  for (let i = 0; i < gamesAsJSON.length; i++) {
    let players = gamesAsJSON[i].playersGames.map(playersGame => {
      return {
        playerId: playersGame.playerId,
        teamId: playersGame.player.teamId,
        fullName: playersGame.player.playerName,
        identifier: playersGame.playerId,
        points: playersGame.points
      }
    });
    let item = {
      id: gamesAsJSON[i].id,
      gameDate: gamesAsJSON[i].gameDate,
      event: gamesAsJSON[i].event,
      teamOne: gamesAsJSON[i].teamOne,
      teamTwo: gamesAsJSON[i].teamTwo,
      isAwarded: gamesAsJSON[i].gamePrize.isAwarded,
      players,
    }
    items.push(item);
  }

  responses.multipleDTOsResponse(res, 200, 'Partidos recuperados con exito', items);
}

const finder = {
  find,
  findById,
  findAll
}

module.exports = finder;
