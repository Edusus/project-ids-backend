require('dotenv').config();

const express = require ('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

// Para crear el servidor
const app= express();

require('./databases/db');

const PORT = process.env.PORT || 3000;

//Para recibir peticiones
app.use(cors());
app.use(express.json());

app.use('/',apiRouter);

app.listen(PORT, ()=>{
    console.log(`Servidor activo en el puerto ${PORT}`);
});