module.exports = (sequelize, type) => {
    return sequelize.define('diaryStatus', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      isAvailable: {
        type: type.BOOLEAN,
        defaultValue: true,
      }
    })
}