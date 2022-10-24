module.exports = (sequelize, type) => {
	return sequelize.define('ad', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		announcer: {
			type: type.STRING,
			allowNull: false
		},
		adType: { 
			type: type.STRING,
			allowNull: false
		},
		redirecTo: { 
			type: type.STRING,
			allowNull: false
		},
		img: { 
			type: type.STRING,
			allowNull: false
		}
	});
};