module.exports = (sequelize, type) => {
	return sequelize.define('deposit', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
        isInSquad: {
            type: type.BOOLEAN,
            defaultValue: false,
        },

    });
}