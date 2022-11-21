module.exports=(sequelize,type)=>{
    return sequelize.define('event',{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        eventName: {
            type:type.STRING,
            allowNull:false
        },
        status: {
            type:type.BOOLEAN,
            defaultValue: false,
            allowNull:false
        }
    });
}