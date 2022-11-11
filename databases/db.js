const { Sequelize, DataTypes } = require('sequelize');
const adsModel = require('../models/adsModel');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
	host: process.env.DBHOST,
	dialect: 'mysql'
});

const ad = adsModel(sequelize, DataTypes);

sequelize.sync()
	.then(() => {
		console.log('Syncronized tables');
	})
  .catch((err) => {
    console.error(err);
  });

module.exports = {
	ad
};