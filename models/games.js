module.exports = (sequelize, type) => {
  return sequelize.define('game', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gameDate: {
      type: type.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Error: gameDate must be a date (in the format yyyy-mm-dd)"
        },
        notEmpty: {
          args: true,
          msg: "Error: gameDate must not be empty"
        }
      }
    }
  }, { 
    sequelize,
    validate: {
      bothTeamsNotEqual() {
        if (this.teamOneId == this.teamTwoId)
          throw new Error('No puedes hacer que un equipo compita contra sí mismo');
      }
    }
  })
}