module.exports = (sequelize, type) => {
  return sequelize.define('team', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      defaultValue: "Bulldog",
      allowNull: false
    },
    badge: {
      type: type.STRING,
      defaultValue: "Offside",
      allowNull: false
    }
  });
};