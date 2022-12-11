const { game, PlayersGame } = require('../../databases/db');
const { csvController, fileController } = require('../filesControllers');
const csv = require('csvtojson');

const post = async (req, res) => {
  try {
    const csvParser = csv({
      trim: true,
      delimiter: [',', ';', '|', '$', '\t'],
      noheader: false,
      headers: ['playerId', 'points'],
      colParser: {
        "playerId": "string",
        "points": "number"
      }
    });
    const { teamOneId, teamTwoId, eventId, matchedAt } = req.body;
    const playersPoints = await csvParser.fromFile(req.file.path);
    const Game = await game.create({
      "teamOneId": teamOneId,
      "teamTwoId": teamTwoId,
      "matchedAt": matchedAt,
      "eventId": eventId
    });
    console.log(Game.id);
    playersPoints.map(playersPoint => playersPoint.gameId = Game.id);
    console.log(playersPoints);
    const PlayersGames = await PlayersGame.bulkCreate(playersPoints);
    res.status(201).json({
      success: true,
      message: 'Partido creado con exito',
      item: {
        Game,
        players: PlayersGames
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