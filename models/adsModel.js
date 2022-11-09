module.exports = (sequelize, type) => {
	return sequelize.define('ad', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		announcer: {
			type: type.STRING,
      defaultValue: "John Doe",
			allowNull: false
		},
		adType: { 
			type: type.ENUM,
      values: ['static', 'float'],
      defaultValue: "static",
			allowNull: false
		},
		redirecTo: { 
			type: type.STRING,
      defaultValue: process.env.OFFSIDEURL,
			allowNull: false
		},
		img: { 
			type: type.STRING,
      defaultValue: process.env.OFFSIDEIMGURL,
			allowNull: false
		}
	});
};