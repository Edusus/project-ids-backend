const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const AdsModel = require('../models/adsModel'); //Vieja implementacion de ads
const PromotionsModel = require('../models/promotionsModel'); //Nueva implementacion de ads
const GamesModel = require('../models/games');
const TeamsModel = require('../models/teamsModel');
const InventoryModel = require('../models/inventory');
const WarehouseModel = require('../models/warehouses');
const PlayersGamesModel = require('../models/playersGames');
const playerFantasyModel = require('../models/playerFantasyModel');



const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Sticker = StickerModel(sequelize,Sequelize);
const Event = EventModel(sequelize,Sequelize);
const Ad = AdsModel(sequelize,Sequelize); //Vieja implementacion de ads
const Promotion = PromotionsModel(sequelize, Sequelize); //Nueva implementacion de ads
const Game = GamesModel(sequelize, Sequelize);
const Team = TeamsModel(sequelize, Sequelize);
const Inventory = InventoryModel(sequelize, Sequelize);
const Warehouse = WarehouseModel(sequelize, Sequelize);
const PlayersGame = PlayersGamesModel(sequelize, Sequelize);
const PlayerFantasy= playerFantasyModel(sequelize,Sequelize);

/* Defining associations */
Team.belongsTo(Event, {
  foreignKey: {
    name: "idEvents"
  }
});
Event.hasMany(Team, {
  foreignKey: {
    name: "idEvents",
    allowNull: false
  }
});

Game.belongsTo(Team, {
  as: 'teamOne',
  foreignKey: {
    allowNull: false
  }
});
Game.belongsTo(Team, {
  as: 'teamTwo',
  foreignKey: {
    allowNull: false
  }
});
Team.hasMany(Game, {
  foreignKey: {
    name: 'teamOneId',
    allowNull: false
  }
});
Team.hasMany(Game, {
  foreignKey: {
    name: 'teamTwoId',
    allowNull: false
  }
});

Team.hasMany(Sticker, { 
  foreignKey: {
    name: "teamId",
    allowNull: false
   } 
});

Sticker.belongsTo(Team,{
  targetkey: 'id',
  foreignKey: {
    name: "teamId",
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


//Relaciones entre usuarios, sticker para formar un inventario
User.belongsToMany(Sticker, { 
  through: Inventory,
});
Sticker.belongsToMany(User, { 
  through: Inventory
});
User.hasMany(Inventory);
Inventory.belongsTo(User);
Sticker.hasMany(Inventory);
Inventory.belongsTo(Sticker);
Event.hasOne(Inventory);
Inventory.belongsTo(Event);

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
  as: 'players',
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
  as: 'games',
  foreignKey: {
    name: 'gameId',
    allowNull: false
  }
});

//Relaciones entre usuarios y stickers para el almacen
User.belongsToMany(Sticker, { 
  through: Warehouse,
});
Sticker.belongsToMany(User, { 
  through: Warehouse
});
User.hasMany(Warehouse);
Warehouse.belongsTo(User);
Sticker.hasMany(Warehouse);
Warehouse.belongsTo(Sticker);

Event.hasMany(Warehouse);
Warehouse.belongsTo(Event);

//Relaciones entre usuarios y eventos para formar un fantasy
User.belongsToMany(Event,{
  through: PlayerFantasy
});
Event.belongsToMany(User,{
  through: PlayerFantasy
});
User.hasMany(PlayerFantasy);
PlayerFantasy.belongsTo(User);
Event.hasMany(PlayerFantasy);
PlayerFantasy.belongsTo(Event);


sequelize.authenticate()
    .then(()=>{
        console.log('Connection has been established successfully.');
    }
    )
    .catch(err=>{
        console.error('Unable to connect to the database:', err);
    }
    );
sequelize.sync({ force: false })
    .then(()=>{
        console.log('Syncronized tables');
    })
    .catch((err) => {
      console.error(err);
    });

const random = sequelize.random();
const { Op } = Sequelize;

module.exports ={
    User, Sticker, Event, Promotion, Ad, Game, Team, random, Op, Inventory, Warehouse, PlayersGame, Promotion, PlayerFantasy
}
