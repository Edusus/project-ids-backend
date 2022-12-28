const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const GamesModel = require('../models/games');
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
const Game = GamesModel(sequelize, Sequelize);
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

Game.belongsTo(team, {
  as: 'teamOne',
  foreignKey: {
    allowNull: false
  }
});
Game.belongsTo(team, {
  as: 'teamTwo',
  foreignKey: {
    allowNull: false
  }
});
team.hasMany(Game, {
  foreignKey: {
    name: 'teamOneId',
    allowNull: false
  }
});
team.hasMany(Game, {
  foreignKey: {
    name: 'teamTwoId',
    allowNull: false
  }
});

Game.belongsTo(Event, {
  foreignKey: {
    name: 'eventId',
    allowNull: false
  }
});
Event.hasMany(Game, {
  foreignKey: {
    name: 'eventId',
    allowNull: false
  }
});

team.hasMany(Sticker, { 
  foreignKey: {
      name: "teamId",
      allowNull: false
   } 
});

Sticker.belongsTo(team,{
  targetkey: 'id',
  foreignKey: {
    name: "teamId",
    allowNull: false
  }
});

Sticker.belongsToMany(Game, {
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
Game.belongsToMany(Sticker, {
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
  as: 'player',
  foreignKey: {
    name: 'playerId',
    allowNull: false
  }
});
Game.hasMany(PlayersGame, {
  foreignKey: {
    name: 'gameId',
    allowNull: false
  }
});
PlayersGame.belongsTo(Game, {
  as: 'game',
  foreignKey: {
    name: 'gameId',
    allowNull: false
  }
});

sequelize.sync({ alter: false })
    .then(()=>{
        console.log('Syncronized tables');
    });

const random = sequelize.random();
const { Op } = Sequelize;

module.exports ={
    User, Sticker, Event, ad, Game, team, PlayersGame, random, Op
}