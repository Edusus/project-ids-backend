const Sequelize = require('sequelize');

const UserModel = require('./../models/users');
const StickerModel = require('../models/sticker');
const EventModel = require('./../models/events');
const adsModel = require('../models/adsModel');
const { addListener } = require('nodemon');



const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Sticker = StickerModel(sequelize,Sequelize);
const Event = EventModel(sequelize,Sequelize);
const ad = adsModel(sequelize,Sequelize);


sequelize.sync({ force: false })
    .then(()=>{
        console.log('Syncronized tables');
    })

module.exports ={
    User, Sticker, Event, ad
}