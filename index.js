require('dotenv').config();

const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api.js')

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log(`The server is listening in port ${PORT}...`);
});
