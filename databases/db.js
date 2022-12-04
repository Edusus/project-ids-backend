const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const teamsModel = require('../models/teamsModel');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Sticker = StickerModel(sequelize,Sequelize);
const Event = EventModel(sequelize,Sequelize);
const team = teamsModel(sequelize, Sequelize);

/* Creating a foreign key relationship between the two tables. */
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

sequelize.sync({force:false})
    .then(()=>{
        console.log('Syncronized tables');
    })
    .catch((err) => {
      console.error(err);
    });

const random = sequelize.random();

module.exports ={
    User, Sticker, Event, team, random
}
