const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bids', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDirectPurchase: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    marketId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'markets',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'bids',
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
        name: "bids_marketId_userId_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "marketId" },
        ]
      },
      {
        name: "marketId",
        using: "BTREE",
        fields: [
          { name: "marketId" },
        ]
      },
    ]
  });
};
