module.exports = (sequelize, type) => {
  return sequelize.define('team', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teamName: {
      type: type.STRING,
      defaultValue: "Bulldog",
      allowNull: false
    }
  });
};