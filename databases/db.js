const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const gamesModel = require('../models/games');
const teamsModel = require('../models/teamsModel');
const PlayersGamesModel = require('../models/playersGames');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Sticker = StickerModel(sequelize,Sequelize);
const Event = EventModel(sequelize,Sequelize);
const ad = adsModel(sequelize,Sequelize);
const game = gamesModel(sequelize, Sequelize);
const team = teamsModel(sequelize, Sequelize);
const PlayersGame = PlayersGamesModel(sequelize, Sequelize);

/* Defining associations */
team.belongsTo(Event, {
  foreignKey: {
    name: "idEvents",
    allowNull: false
  }
});
Event.hasMany(team, {
  foreignKey: {
    name: "idEvents",
    allowNull: false
  }
});

game.belongsTo(team, {
  as: 'teamOne',
  foreignKey: {
    allowNull: false
  }
});
game.belongsTo(team, {
  as: 'teamTwo',
  foreignKey: {
    allowNull: false
  }
});
team.hasMany(game, {
  foreignKey: {
    name: 'teamOneId',
    allowNull: false
  }
});
team.hasMany(game, {
  foreignKey: {
    name: 'teamTwoId',
    allowNull: false
  }
});

game.belongsTo(Event, {
  foreignKey: {
    name: 'eventId',
    allowNull: false
  }
});
Event.hasMany(game, {
  foreignKey: {
    name: 'eventId',
    allowNull: false
  }
});

Sticker.belongsToMany(game, {
  through: PlayersGame, 
  foreignKey: { 
    name: 'playerId',
    allowNull: false 
  }, 
  otherKey: { 
    name: 'gameId',
    allowNull: false 
  } 
});
game.belongsToMany(Sticker, {
  as: 'players', 
  through: PlayersGame,
  foreignKey: {
    name: 'gameId',
    allowNull: false
  }, 
  otherKey: { 
    name: 'playerId',
    allowNull: false 
  } 
});
Sticker.hasMany(PlayersGame, {
  foreignKey: {
    name: 'playerId',
    allowNull: false
  }
});
PlayersGame.belongsTo(Sticker, {
  as: 'players',
  foreignKey: {
    name: 'playerId',
    allowNull: false
  }
});
game.hasMany(PlayersGame, {
  foreignKey: {
    name: 'gameId',
    allowNull: false
  }
});
PlayersGame.belongsTo(game, {
  as: 'games',
  foreignKey: {
    name: 'gameId',
    allowNull: false
  }
});

sequelize.sync({ force: false })
    .then(()=>{
        console.log('Syncronized tables');
    });

const random = sequelize.random();
const { Op } = Sequelize;

module.exports ={
    User, Sticker, Event, ad, game, team, PlayersGame, random, Op
}