const Sequelize = require('sequelize');

const UserModel =require('./../models/users');
const ChromeModel = require('./../models/chromes');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD,{
    host: process.env.DBHOST,
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Chrome = ChromeModel(sequelize,Sequelize);


sequelize.sync({force:false})
    .then(()=>{
        console.log('Syncronized tables');
    })

module.exports ={
    User, Chrome
}