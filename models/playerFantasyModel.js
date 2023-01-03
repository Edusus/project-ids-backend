module.exports = (sequelize, type) => {
    return sequelize.define('playerFantasyModel', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      points: {
        type: type.INTEGER,
        defaultValue: 0,
      },
      money: {
        type: type.INTEGER,
        defaultValue: 0,
      }
    })
}