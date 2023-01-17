const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('teams', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    badge: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "undefined\/uploads\/offside.png"
    },
    idEvents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'teams',
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
        name: "idEvents",
        using: "BTREE",
        fields: [
          { name: "idEvents" },
        ]
      },
    ]
  });
};
