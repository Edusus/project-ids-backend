module.exports=(sequelize,type)=>{
    return sequelize.define('user',{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:true
        },
        name: {
            type:type.STRING,
            allowNull:false,
            unique: true
        },
        role: {
            type:type.STRING,
            allowNull:false
        },
        email: {
            type:type.STRING,
            allowNull:false,
            unique: true
        },
        password: {
            type:type.STRING,
            allowNull:false
        }
    });
}
