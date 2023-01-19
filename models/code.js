module.exports = (sequelize, type) => {
    return sequelize.define('code', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      verificationCode: {
        type: type.STRING,
        allowNull: false,
        unique: true
    },
      isAvailable: {
        type: type.BOOLEAN,
        defaultValue: true,
      }
    })
}