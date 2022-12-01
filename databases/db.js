const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const gamesModel = require('../models/games');
const teamsModel = require('../models/teamsModel');

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
    User, Sticker, Event, ad, game, team, random, Op
}