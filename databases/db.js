const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const ItemModel = require('../models/item');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const gamesModel = require('../models/games');
const teamsModel = require('../models/teamsModel');
const inventoryModel = require('../models/inventory');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Item = ItemModel(sequelize,Sequelize);
const Event = EventModel(sequelize,Sequelize);
const ad = adsModel(sequelize,Sequelize);
const game = gamesModel(sequelize, Sequelize);
const team = teamsModel(sequelize, Sequelize);
const inventory = inventoryModel(sequelize, Sequelize);
const Deposit = 
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

team.hasMany(Item, { 
  foreignKey: {
      name: "teamId",
      allowNull: false
   } 
});

Item.belongsTo(team,{
  targetkey: 'id',
  foreignKey: {
    name: "teamId",
    allowNull: false
  }
});


//Relaciones entre usuarios, sticker para formar un inventario
User.belongsToMany(Item, { 
  through: inventory,
});
Item.belongsToMany(User, { 
  through: inventory
});
User.hasMany(inventory);
inventory.belongsTo(User);
Item.hasMany(inventory);
inventory.belongsTo(Item);
Event.hasOne(inventory);
inventory.belongsTo(Event);

sequelize.sync({ force: false })
    .then(()=>{
        console.log('Syncronized tables');
    });

const random = sequelize.random();
const { Op } = Sequelize;

module.exports ={
    User, Item, Event, ad, game, team, random, Op, inventory
}