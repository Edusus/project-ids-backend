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
const playerFantasyModel = require('../models/playerFantasy');
const MarketModel = require('../models/market');
const BidsModel = require('../models/bids');


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
const PlayerFantasy= playerFantasyModel(sequelize,Sequelize);
const Market = MarketModel(sequelize, Sequelize);
const Bid = BidsModel(sequelize, Sequelize);


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

Team.hasOne(Game, {
  as: 'teamOne'
});
Team.hasOne(Game, {
  as: 'teamTwo'
})
Game.belongsTo(Team, {
  as: 'teamOne'
});
Game.belongsTo(Team, {
  as: 'teamTwo'
})

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
    allowNull: false
  }
});

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
    User, Sticker, Event, Ad, Game, Team, random, Op, Inventory, Warehouse, Promotion, PlayerFantasy, Market, Bid
}
