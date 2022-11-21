const { Sequelize, DataTypes } = require('sequelize');
const teamsModel = require('../models/teamsModel');
const EventModel = require('../models/events');

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
	host: process.env.DBHOST,
	dialect: 'mysql'
});

const team = teamsModel(sequelize, DataTypes);
const Event = EventModel(sequelize, DataTypes);

/* Creating a foreign key relationship between the two tables. */
team.belongsTo(Event, {
  foreignKey: {
    name: "idEvents",
    allowNull: false
  }
});

sequelize.sync()
	.then(() => {
		console.log('Syncronized tables');
	})
  .catch((err) => {
    console.error(err);
  });

module.exports = {
	team, Event
};