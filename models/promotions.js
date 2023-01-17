const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promotions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    alias: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "John Doe"
    },
    promotionType: {
      type: DataTypes.ENUM('static','popup'),
      allowNull: false,
      defaultValue: "static"
    },
    redirecTo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "https:\/\/backend-staging.playoffside.online\/uploads\/img\/offside.png"
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    requestedQuantities: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    clickedQuantities: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'promotions',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
