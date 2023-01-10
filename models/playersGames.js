module.exports = (sequelize, type) => {
  return sequelize.define('playersGame', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    points: {
      type: type.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "Error: points must be represented by an integer"
        }
      }
    }
  })
}