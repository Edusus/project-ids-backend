module.exports = (sequelize, type) => {
	return sequelize.define('deposit', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true
        },
        
    })
}