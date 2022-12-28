const { Game, PlayersGame } = require('../../databases/db');
const csv = require('csvtojson');
const { fileController } = require('../filesControllers');
const responses = require('../../utils/responses/responses');

const post = async (req, res) => {
  try {
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
    const { teamOneId, teamTwoId, eventId, gameDate } = req.body;
    const playersPoints = await csvParser.fromFile(req.file.path);
    const game = await Game.create({
      teamOneId,
      teamTwoId,
      gameDate,
      eventId
    });
    playersPoints.map(playersPoint => playersPoint.gameId = game.id);
    console.log(playersPoints);
    const playersGames = await PlayersGame.bulkCreate(playersPoints);
    res.status(201).json({
      success: true,
      message: 'Partido creado con exito',
      item: {
        game,
        players: playersGames
      }
    });
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      res.status(400).send(error.message);
    } else {
      res.status(400).send('Error: csv not sent');
    }
  }
}

const poster = {
  post
}

module.exports = poster;