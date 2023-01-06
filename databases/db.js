const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel'); //Vieja implementacion de ads
const PromotionsModel = require('../models/promotionsModel'); //Nueva implementacion de ads
const gamesModel = require('../models/games');
const teamsModel = require('../models/teamsModel');
const inventoryModel = require('../models/inventory');
const playerFantasyModel = require('../models/playerFantasyModel');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Sticker = StickerModel(sequelize,Sequelize);
const Event = EventModel(sequelize,Sequelize);
const ad = adsModel(sequelize,Sequelize); //Vieja implementacion de ads
const Promotion = PromotionsModel(sequelize, Sequelize); //Nueva implementacion de ads
const game = gamesModel(sequelize, Sequelize);
const team = teamsModel(sequelize, Sequelize);
const inventory = inventoryModel(sequelize, Sequelize);
const PlayerFantasy= playerFantasyModel(sequelize,Sequelize);
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
    User, Sticker, Event, Promotion, ad, game, team, random, Op, inventory, PlayerFantasy
}
