module.exports=(sequelize,type)=>{
    return sequelize.define('chrome',{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:true
        },
        playerName:{
            type:type.STRING,
            allowNull:false
        },
        team:{
            type:type.STRING,
            allowNull:false
        },
        country:{
            type:type.STRING,
            allowNull:false
        },
        position:{
            type:type.STRING,
            allowNull:false
        },
        img:{
            type:type.STRING,
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