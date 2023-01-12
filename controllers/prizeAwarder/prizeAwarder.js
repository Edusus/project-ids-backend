const { Op } = require('sequelize');
const { Game, GamePrize, PlayersGame, PlayerFantasy, Warehouse } = require('../../databases/db');

const award = async () => {
  const notAwardedGamesAsOfToday = await Game.findAll({
    attributes: ['id', 'gameDate', 'eventId'],
    where: {
      gameDate: {
        [Op.lte]: new Date().setUTCHours(23, 59, 99, 999)
      }
    },
    include: [
      {
        model: GamePrize,
        attributes: ['id','isAwarded'],
        where: {
          isAwarded: false
        }
      },
      {
        model: PlayersGame,
        attributes: ['id', 'points', 'playerId']
      }
    ]
  });

  await Promise.all(notAwardedGamesAsOfToday.map(async notAwardedGame => {
    const playersFantasies = await PlayerFantasy.findAll({
      attributes: ['id', 'points', 'money', 'userId'],
      where: {
        eventId: notAwardedGame.eventId 
      }
    });

    playersFantasies.map(async playerFantasy => {
      const lineups = await Warehouse.findAll({
        attributes: ['id', 'isInLineup', 'quantity', 'stickerId'],
        where: {
          userId: playerFantasy.userId,
          eventId: notAwardedGame.eventId,
          isInLineup: true
        }
      });

      lineups.map(lineup => {
        notAwardedGame.playersGames.map(async playersGame => {
          if (playersGame.playerId == lineup.stickerId) {
            await playerFantasy.increment(['points', 'money'], { by: playersGame.points});
            await playerFantasy.reload();
          } 
        });
      });
    });

    await notAwardedGame.gamePrize.update({ isAwarded: true });
    await notAwardedGame.gamePrize.reload();
  }));
  
  return;
}

const prizeAwarder = {
  award
}

module.exports = prizeAwarder;