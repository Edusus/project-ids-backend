module.exports = (sequelize, type) => {
    return sequelize.define('market', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      initialPurchaseValue: {
        type: type.INTEGER,
        defaultValue: 0,
      },
      immediatePurchaseValue: {
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
       },
      isFinished: {
        type: type.BOOLEAN,
        defaultValue: false,
      }
    })
}