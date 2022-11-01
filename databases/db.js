const Sequelize = require('sequelize');

const UserModel =require('./../models/users');
const ChromeModel = require('./../models/chromes');


const sequelize = new Sequelize('offside','root','',{
    host:'127.0.0.1',
    dialect:'mysql'
});

const User = UserModel(sequelize,Sequelize);
const Chrome = ChromeModel(sequelize,Sequelize);


sequelize.sync({force:false})
    .then(()=>{
        console.log('Tablas creadas');
    })

module.exports ={
    User, Chrome
}