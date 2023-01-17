const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    announcer: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "John Doe"
    },
    adType: {
      type: DataTypes.ENUM('static','float'),
      allowNull: false,
      defaultValue: "static"
    },
    redirecTo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    requestedQuantities: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    clickedQuantities: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'ads',
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
