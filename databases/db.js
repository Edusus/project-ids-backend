const { Sequelize, DataTypes } = require('sequelize');
const PromotionsModel = require('../models/promotionsModel');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
	host: process.env.DBHOST,
	dialect: 'mysql'
});

const Promotion = PromotionsModel(sequelize, DataTypes);

sequelize.sync()
	.then(() => {
		console.log('Syncronized tables');
	})
  .catch((err) => {
    console.error(err);
  });

module.exports = {
	Promotion
};