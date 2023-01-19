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
const PlayerFantasyModel = require('../models/playerFantasy');
const MarketModel = require('../models/market');
const BidsModel = require('../models/bids');
const PlayersGamesModel = require('../models/playersGames');
const DiaryStatusModel = require('../models/diaryStatus');
const codeUser = require('../models/code');


const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql',
    // disable logging; default: console.log
    //logging: false
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
const PlayerFantasy= PlayerFantasyModel(sequelize,Sequelize);
const Market = MarketModel(sequelize, Sequelize);
const Bid = BidsModel(sequelize, Sequelize);
const DiaryStatus = DiaryStatusModel(sequelize, Sequelize);
const Code = codeUser(sequelize, Sequelize);

/* Defining associations */
// Asociacion Event -> Teams
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

// Asociacion Team -> Games
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

// Asociacion Event -> Games
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

// Asociacion Team -> Stickers
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

//Asociacion Stickers <-> Games a traves de PlayersGames
Sticker.belongsToMany(Game, {
  through: PlayersGame, 
  foreignKey: { 
    name: 'playerId',
    allowNull: false 
  }, 
  otherKey: { 
    name: 'gameId',
    allowNull: false 
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE' 
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
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE' 
});
Sticker.hasMany(PlayersGame, {
  foreignKey: {
    name: 'playerId',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
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
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
PlayersGame.belongsTo(Game, {
  as: 'game',
  foreignKey: {
    name: 'gameId',
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
Sticker.hasMany(Inventory);
Inventory.belongsTo(Sticker);
Inventory.belongsTo(Event);

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

// Asociacion Event -> Warehouses
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

//Relaciones para formar el mercado todo lo que tiene que ver con el mercado
Event.belongsToMany(Sticker, {
  through: Market,
  uniqueKey: false,
  foreignKey: {
    unique: false
  },
  otherKey: {
    unique: false
  }
  });
Sticker.belongsToMany(Event, {
  through: Market,
  uniqueKey: false,
  foreignKey: {
    unique: false
  },
  otherKey: {
    unique: false
  }
});
User.belongsToMany(Sticker, {
  through: Market,
  uniqueKey: false,
  foreignKey: {
    unique: false
  },
  otherKey: {
    unique: false
  }
});
Sticker.belongsToMany(User, { 
  through: Market,
  uniqueKey: false,
  foreignKey: {
    unique: false
  },
  otherKey: {
    unique: false
  }
});

Event.hasMany(Market, {
  uniqueKey: false
});
Market.belongsTo(Event, {
  uniqueKey: false
});
Sticker.hasMany(Market, {
  uniqueKey: false
});
Market.belongsTo(Sticker, {
  uniqueKey: false
});
User.hasMany(Market, {
  uniqueKey: false
});
Market.belongsTo(User, {
  uniqueKey: false
});

//Relaciones para formar las subastas
User.belongsToMany(Market, {
  through: Bid
});
Market.belongsToMany(User, {
  through: Bid
});
User.hasMany(Bid);
Bid.belongsTo(User);
Market.hasMany(Bid);
Bid.belongsTo(Market);

//Relaciones para formar la tabla de get diary status
User.hasMany(DiaryStatus, {
  foreignKey: {
    unique: false
  }
});
DiaryStatus.belongsTo(User, {
  foreignKey: {
    unique: false
  }
});

//Relaciones para formar la tabla de code for user

User.hasMany(Code, {
  foreignKey: {
    unique: false
  }
});

Code.belongsTo(User, {
  foreignKey: {
    unique: false
  }
});



sequelize.authenticate()
    .then(()=>{
        console.log('Connection has been established successfully.');
    }
    )
    .catch(err=>{
        console.error('Unable to connect to the database:', err);
    }
    );
sequelize.sync({ alter: false })
    .then(()=>{
        console.log('Syncronized tables');
    })
    .catch((err) => {
      console.error(err);
    });

const random = sequelize.random();
const createTransaction = () => {
  return sequelize.transaction();
}

const { Op } = Sequelize;

module.exports = {
  User, Sticker, Event, Ad, Game, Team, random, Op, Inventory, Warehouse, Promotion, PlayerFantasy, createTransaction, Market, Bid, PlayersGame, sequelize, DiaryStatus, Code
}
