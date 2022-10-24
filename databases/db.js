const Sequelize = require('sequelize');

const AdsModel = require('./models/ads');

const db = new Sequelize('ads', 'root', 'fN09KxrhYV2w!K*P', {
	host: '127.0.0.1',
	dialect: 'mysql'
});

const Ad = AdsModel(db, Sequelize);

db.sync({ force: false })
	.then(() => {
		console.log('Syncronized tables');
	});

module.exports = {
	Ad
};