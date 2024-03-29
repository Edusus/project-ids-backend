const getImageUrl = require('../utils/helpers/get-image-url');
const promotiontypes = ['static', 'popup'];

module.exports = (sequelize, type) => {
	return sequelize.define('promotion', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		alias: {
			type: type.STRING,
      defaultValue: "John Doe",
			allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Empty alias not allowed'
        }
      }
		},
		promotionType: { 
			type: type.ENUM,
      values: promotiontypes,
      defaultValue: "static",
			allowNull: false,
      validate: {
        isIn: {
          args: [promotiontypes],
          msg: "promotiontype has to be either static or popup"
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
          msg: 'You must redirect somewhere. Insert a valid url' 
        }
      }
		},
		img: { 
			type: type.STRING,
      defaultValue: getImageUrl('offside.png'),
			allowNull: false
		},
    description: {
      type: type.STRING,
      defaultValue: null,
      allowNull: true
    },
    requestedQuantities: {
      type: type.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    clickedQuantities: {
      type: type.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
	});
};