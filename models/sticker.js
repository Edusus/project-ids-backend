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
            type: type.UUID,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                  args: true,
                  msg: 'Un externalUUID vacio no esta permitido'
                },
                notNull: {
                  args: true,
                  msg: "Un externalUUID nulo no esta permitido"
                },
                isUUID: {
                  args: 4,
                  msg: "Un externalUUID que no sea un UUID no está permitido"
                }
            }
        },
        jerseyNumber:{
            type:type.INTEGER,
            allowNull:false
        }
    })
}
