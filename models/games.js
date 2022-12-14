module.exports = (sequelize, type) => {
  return sequelize.define('game', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matchedAt: {
      type: type.STRING,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Error: matchedAt must be a date"
        },
        notEmpty: {
          args: true,
          msg: "Error: mactchedAt must not be empty"
        }
      }
    }
  })
}