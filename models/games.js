const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('games', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gameDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    teamOneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    teamTwoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'games',
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
      {
        name: "teamOneId",
        using: "BTREE",
        fields: [
          { name: "teamOneId" },
        ]
      },
      {
        name: "teamTwoId",
        using: "BTREE",
        fields: [
          { name: "teamTwoId" },
        ]
      },
      {
        name: "eventId",
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
    ]
  });
};
