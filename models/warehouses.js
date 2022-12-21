module.exports = (sequelize, type) => {
	return sequelize.define('warehouse', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    isInLineup: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  });
}