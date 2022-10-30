const Sequelize = require('sequelize');

//Para requerir el modelo de la tabla a crear

const ChromeModel = require('./models/chromes');

/*Para conectar la base de datos. Se especifica 
nombre_baseDatos, Username, password, objeto con URL 
donde se encuentra base de datos y el dialect*/
const sequelize = new Sequelize('offside','root','',{
    host:'127.0.0.1',
    dialect:'mysql'
});
//PARA generar la tabla

const Chrome = ChromeModel(sequelize,Sequelize);

//PAra sincronizar con la base de datos
sequelize.sync({force:false})
    .then(()=>{
        console.log('Tablas creadas');
    })
    
//Para utilizar el objeto en otros archivos

module.exports ={
    Chrome
}