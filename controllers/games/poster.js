const csv = require('csvtojson');
const { Game, GamePrize, PlayersGame, Team, Event, Sticker, createTransaction } = require('../../databases/db');
const { fileController } = require('../filesControllers');
const responses = require('../../utils/responses/responses');

const post = async (req, res) => {
  let transaction = false;
  try {
    const { teamOneId, teamTwoId, eventId, gameDate } = req.body;

    if (!await Event.findByPk(eventId)) 
      return responses.errorDTOResponse(res, 404, 'No se ha encontrado el evento especificado');

    if (teamOneId == teamTwoId) 
      return responses.errorDTOResponse(res, 409, 'No puedes hacer que un equipo compita contra sí mismo');
    
    const teamOne = await Team.findByPk(teamOneId, {
      attributes: ['id', 'idEvents']
    });

    const teamTwo = await Team.findByPk(teamTwoId, {
      attributes: ['id','idEvents']
    });

    if (!teamOne || !teamTwo) 
      return responses.errorDTOResponse(res, 404, 'No se ha encontrado a uno de los equipos');

    if (teamOne.idEvents != teamTwo.idEvents)
      return responses.errorDTOResponse(res, 400, 'Equipos de distintos eventos no pueden participar en un mismo partido');

    if (teamOne.idEvents != eventId || teamTwo.idEvents != eventId)
      return responses.errorDTOResponse(res, 400, 'Los equipos no pueden participar en partidos de un evento al que no pertenecen');

    const csvParser = csv({
      trim: true,
      delimiter: [',', ';', '|', '$', '\t'],
      noheader: false,
      headers: ['playerId', 'points'],
      colParser: {
        "playerId": "number",
        "points": "number"
      }
    });

    const playersPoints = await csvParser.fromFile(req.file.path);
    const playersIds = playersPoints.map(playersPoint => playersPoint.playerId);

    const foundPlayers = await Sticker.findAll({
      where: {
        id: playersIds
      }
    });

    if (foundPlayers.length < playersIds.length)
      return responses.errorDTOResponse(res, 404, 'No se ha encontrado a uno de los jugadores especificados');

    let foundAllPlayers = true;
    for (foundPlayer of foundPlayers) {
      if (!(foundPlayer.teamId == teamOneId || foundPlayer.teamId == teamTwoId)) {
        foundAllPlayers = false;
        responses.errorDTOResponse(res, 400, `El jugador ${foundPlayer.id} no forma parte de ninguno de los equipos que compiten`);
        break;
      }
    }
    
    if (!foundAllPlayers)
      return;

    transaction = await createTransaction();
    const game = await Game.create({
      teamOneId,
      teamTwoId,
      gameDate,
      eventId
    }, {
      transaction
    });

    await GamePrize.create({
      gameId: game.id
    }, {
      transaction
    });

    playersPoints.map(playersPoint => playersPoint.gameId = game.id);
    const playersGames = await PlayersGame.bulkCreate(playersPoints, {
      transaction
    });
    await transaction.commit();

    let players = await Promise.all(playersGames.map(async (playersGame) => {
      let playerPersonalInfo = JSON.parse(JSON.stringify(await playersGame.getPlayer()));
      return {
        playerId: playersGame.playerId,
        teamId: playerPersonalInfo.teamId,
        fullName: playerPersonalInfo.playerName,
        identifier: playersGame.playerId,
        points: playersGame.points
      }
    }));

    const item = {
      id: game.id,
      gameDate: game.gameDate,
      eventId: game.eventId,
      teamOne: game.teamOne,
      teamTwo: game.teamTwo,
      players,
    }

    return responses.singleDTOResponse(res, 201, 'Partido creado con exito', item);
  } catch (error) {
    if (transaction)
      await transaction.rollback();

    if (typeof req.file === 'undefined')
      return responses.errorDTOResponse(res, 500, 'Error al subir / decodificar el csv');
      
    fileController.deleteFile(req.file.path, req.file.filename);
    return responses.errorDTOResponse(res, 400, error.message);
  }
}

const poster = {
  post
}

module.exports = poster;
