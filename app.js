require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes.js');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`The server is listening in port ${PORT}...`);
})
