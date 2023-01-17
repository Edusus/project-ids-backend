const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('markets', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    initialPurchaseValue: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    immediatePurchaseValue: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    finishDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isFinished: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    undefined: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "markets_ibfk_1"
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    stickerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stickers',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'markets',
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
        name: "markets___unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "undefined" },
        ]
      },
      {
        name: "eventId",
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
      {
        name: "stickerId",
        using: "BTREE",
        fields: [
          { name: "stickerId" },
        ]
      },
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
