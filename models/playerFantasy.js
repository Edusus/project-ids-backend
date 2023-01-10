module.exports = (sequelize, type) => {
    return sequelize.define('playerFantasy', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      points: {
        type: type.INTEGER,
        allowNull:false,
        defaultValue: 0,
      },
      money: {
        type: type.INTEGER,
        allowNull:false,
        defaultValue: 0,
      }
    })
}