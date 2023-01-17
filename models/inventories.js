const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inventories', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    isInAlbum: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Quantity: {
      type: DataTypes.INTEGER,
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
    stickerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stickers',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'inventories',
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
        name: "inventories_stickerId_userId_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "stickerId" },
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
        name: "eventId",
        using: "BTREE",
        fields: [
          { name: "eventId" },
        ]
      },
    ]
  });
};
