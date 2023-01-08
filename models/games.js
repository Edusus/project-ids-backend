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
          msg: "El campo gameDate esta en el formato incorrecto (formato correcto: yyyy-mm-dd)"
        },
        notEmpty: {
          args: true,
          msg: "gameDate no debe estar vacio"
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