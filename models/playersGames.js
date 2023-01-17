const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('playersgames', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stickers',
        key: 'id'
      }
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'playersgames',
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
        name: "playersGames_gameId_playerId_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "playerId" },
          { name: "gameId" },
        ]
      },
      {
        name: "gameId",
        using: "BTREE",
        fields: [
          { name: "gameId" },
        ]
      },
    ]
  });
};
