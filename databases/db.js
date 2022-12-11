const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const gamesModel = require('../models/games');
const teamsModel = require('../models/teamsModel');
const inventoryModel = require('../models/inventory');
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
const inventory = inventoryModel(sequelize, Sequelize);
const PlayersGame = PlayersGamesModel(sequelize, Sequelize);

/* Defining associations */
team.belongsTo(Event, {
  foreignKey: {
    name: "idEvents"
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

//Relaciones entre usuarios, sticker para formar un inventario
User.belongsToMany(Sticker, { 
  through: inventory,
});
Sticker.belongsToMany(User, { 
  through: inventory
});
User.hasMany(inventory);
inventory.belongsTo(User);
Sticker.hasMany(inventory);
inventory.belongsTo(Sticker);
Event.hasOne(inventory);
inventory.belongsTo(Event);

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

team.hasMany(Sticker, { 
    as: "team", 
    foreignKey: {
        name: "teamId",
        allowNull: false
     } 
});

Sticker.belongsTo(team, {
     as: "team", 
     foreignKey: {
       name: "teamId",
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
    User, Sticker, Event, ad, game, team, random, Op, inventory, PlayersGame
}