module.exports = (sequelize, type) => {
    return sequelize.define('market', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      initialValue: {
        type: type.INTEGER,
        defaultValue: 0,
      },
      directPurchase: {
        type: type.INTEGER,
        defaultValue: 0,
      },
      finishDate: {
        type: type.DATE,
        allowNull: false,
        validate: {
            isDate: {
                args: true,
                msg: "Error: finishDate must be a date"
            },
            notEmpty: {
                args: true,
                msg: "Error: finishDate must not be empty"
            }
        }
       } 
    })
}