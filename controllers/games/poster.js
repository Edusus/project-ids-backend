const csv = require('csvtojson');
const { Game, PlayersGame, Team, Event, Sticker, createTransaction } = require('../../databases/db');
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

    if (teamOne.dataValues.idEvents != teamTwo.dataValues.idEvents)
      return responses.errorDTOResponse(res, 400, 'Equipos de distintos eventos no pueden participar en un mismo partido');

    if (teamOne.dataValues.idEvents != eventId || teamTwo.dataValues.idEvents != eventId)
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
      if (!(foundPlayer.dataValues.teamId == teamOneId || foundPlayer.dataValues.teamId == teamTwoId)) {
        foundAllPlayers = false;
        responses.errorDTOResponse(res, 400, `El jugador ${foundPlayer.dataValues.id} no forma parte de ninguno de los equipos que compiten`);
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

    responses.singleDTOResponse(res, 201, 'Partido creado con exito', item);
  } catch (error) {
    if (transaction)
      await transaction.rollback();

    console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      return responses.errorDTOResponse(res, 400, error.message);
    }
    return responses.errorDTOResponse(res, 500, 'Error al subir / decodificar el csv');
  }
}

const poster = {
  post
}

module.exports = poster;