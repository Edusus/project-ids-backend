module.exports = (sequelize, type) => {
  return sequelize.define('gamePrize', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    isAwarded: {
      type: type.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  })
}