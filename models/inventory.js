module.exports = (sequelize, type) => {
    return sequelize.define('inventory', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      isInAlbum: {
        type: type.BOOLEAN,
        defaultValue: false,
      },
      Quantity: {
        type: type.INTEGER,
        defaultValue: 0,
      }
    })
}