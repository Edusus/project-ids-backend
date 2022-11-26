module.exports = (sequelize, type) => {
  return sequelize.define('team', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    badge: {
      type: type.STRING,
      defaultValue: `${process.env.OFFSITEURL}\\uploads\\offside.png`,
      allowNull: false
    }
  });
};