const express = require('express');
const routes = require('./routes.js');

const app = express();

const PORT = process.env.PORT || 8080;

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`The server is listening in port ${PORT}...`);
})
