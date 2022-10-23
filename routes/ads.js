const { Router } = require('express');
const ads = Router();

ads.get('/', (req, res) => {
  res.send('get ads');
})

//To create an ad
ads.post('/create', (req, res) => {
  //TODO: La lógica para la inserción del usuario en la tabla con Sequelize
  res.send('ad creada papu');
})

module.exports = ads;