const { Router } = require('express');
const { Op } = require('sequelize');
const { team } = require('../../databases/db');

const teamsRouter = Router();

module.exports = teamsRouter;