const Sequelize = require('sequelize');

const AdsModel = require('../models/adsModel');

const db = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
	host: process.env.DBHOST,
	dialect: 'mysql'
});

const ad = AdsModel(db, Sequelize);

db.sync({ force: false })
	.then(() => {
		console.log('Syncronized tables');
	});

module.exports = {
	ad
};