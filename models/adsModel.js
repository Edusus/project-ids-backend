const adtypes = ['static', 'float'];

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
      values: adtypes,
      defaultValue: "static",
			allowNull: false,
      validate: {
        isIn: {
          args: [adtypes],
          msg: "adtype has to be either static or float."
        }
      }
		},
		redirecTo: { 
			type: type.STRING,
      defaultValue: process.env.OFFSIDEURL,
			allowNull: false,
      validate: {
        isUrl: {
          args: true,
          msg: 'You must redirect somewhere. Insert a valid url.'
        }
      }
		},
		img: { 
			type: type.STRING,
      defaultValue: process.env.OFFSIDEIMGURL,
			allowNull: false
		}
	});
};