module.exports=(sequelize,type)=>{
    return sequelize.define('sticker',{
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
        country:{
            type:type.STRING,
            allowNull: true 
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
        },
        externalUuid:{
            type:type.STRING,
            allowNull:false,
            validate: {
                notEmpty: {
                  args: true,
                  msg: 'externalUuid vacio no esta permitido'
                }
            }
        },
        jerseynumber:{
            type:type.INTEGER,
            allowNull:false
        }
    })
}
