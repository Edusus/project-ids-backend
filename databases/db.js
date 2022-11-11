const { Sequelize, DataTypes } = require('sequelize');
const teamsModel = require('../models/teamsModel');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
	host: process.env.DBHOST,
	dialect: 'mysql'
});

const team = teamsModel(sequelize, DataTypes);

sequelize.sync()
	.then(() => {
		console.log('Syncronized tables');
	})
  .catch((err) => {
    console.error(err);
  });

module.exports = {
	team
};