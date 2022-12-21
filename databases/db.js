const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const gamesModel = require('../models/games');
const teamsModel = require('../models/teamsModel');
const inventoryModel = require('../models/inventory');
const WarehouseModel = require('../models/warehouses');

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
const Warehouse = WarehouseModel(sequelize, Sequelize);

/* Defining associations */
team.belongsTo(Event, {
  foreignKey: {
    name: "idEvents"
  }
});
Event.hasMany(team, {
  foreignKey: {
    name: "idEvents"
  }
});

team.hasOne(game, {
  as: 'teamOne'
});
team.hasOne(game, {
  as: 'teamTwo'
})
game.belongsTo(team, {
  as: 'teamOne'
});
game.belongsTo(team, {
  as: 'teamTwo'
})

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

Event.hasOne(Warehouse);
Warehouse.belongsTo(Event);

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
    });

const random = sequelize.random();
const { Op } = Sequelize;

module.exports ={
    User, Sticker, Event, ad, game, team, random, Op, inventory, Warehouse
}