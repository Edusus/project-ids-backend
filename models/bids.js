module.exports = (sequelize, type) => {
    return sequelize.define('bids', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        value: {
            type: type.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: "Error: value must be an integer"
                },
                notEmpty: {
                    args: true,
                    msg: "Error: value must not be empty"
                }
            }
        },
    })
}