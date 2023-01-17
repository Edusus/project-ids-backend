const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stickers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    playerName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    appearanceRate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    externalUuid: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    jerseyNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'stickers',
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
      {
        name: "teamId",
        using: "BTREE",
        fields: [
          { name: "teamId" },
        ]
      },
    ]
  });
};
