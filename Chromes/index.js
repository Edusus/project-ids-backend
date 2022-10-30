//Instalaciones
/*
npm i body-parser
npm i sequelize
npm i mysql2
*/

//IMportaciones

const express = require ('express');

//Para poder recibir peticiones POST
const bodyParser = require ('body-parser');

//
const apiRouter = require('./routes/api');

// Para crear el servidor
const app= express();

require('./dataBase');

//Para recibir peticiones POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api',apiRouter);

app.listen(3000, ()=>{
    console.log('Servidor arrancado en puerto 3000');
});