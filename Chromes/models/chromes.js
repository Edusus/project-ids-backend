module.exports=(sequelize,type)=>{
    return sequelize.define('chrome',{
        playerName:{
            type:type.STRING,
            primaryKey:true,
            allowNull:false
        },
        height: {
            type:type.FLOAT,
            allowNull:false
        },
        weight:{
            type:type.FLOAT,
            allowNull:false
        },
        appearanceRate:{
            type:type.FLOAT,
            allowNull:false
        }
    })
}