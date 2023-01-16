const router = require('express').Router();
const responses = require('../../utils/responses/responses');
const { rankingDTOPaginate } = require('../../controllers/ranking/utils');
const { User, PlayerFantasy, Event, Op, sequelize } = require('../../databases/db');
const Sequelize = require('sequelize');

router.get('/', async (req,res)=>{
    const eventId = req.eventId;
    const event = await Event.findOne({
        raws:true,
        where: {id : eventId}
    });
    if (!event) {
        return responses.errorDTOResponse(res,404,"Evento no encontrado");
    }

    const { page = 0, size = 10 } = req.query;
    let options = {
        raws: true,
        order: [
            ['points', 'DESC'],
            [`updatedAt`, `ASC`]
        ],
        attributes: [
            "id", "points", "userId", "eventId",
            [Sequelize.literal(`RANK() OVER (ORDER BY points DESC, '${PlayerFantasy.getTableName()}'.'updatedAt' ASC)`), 'rank']
        ],
        where: { eventId: eventId }
    };

    try {

        const { count, rows } = await PlayerFantasy.findAndCountAll({
            limit: +size,
            offset: (+page) * (+size),
            ...options,
            include : {
                model: User,
                attributes: ['name']
            }
        });
    
        const queryInterfaceSequelize = await sequelize.getQueryInterface();
        
        const rankingTableSubQuery = queryInterfaceSequelize.queryGenerator.selectQuery(
            PlayerFantasy.getTableName(),
            {
                ...options,
            },
            PlayerFantasy
        ).replace(';','');
    
        const myPosition = await sequelize.query(
            `SELECT * FROM
            (${rankingTableSubQuery}) rankingRable WHERE userId = ${req.user.id.id};`, 
        {
            raw: true,
            type: Sequelize.QueryTypes.SELECT
        });
    
        return rankingDTOPaginate(res, 200, 'Ranking global', myPosition[0] || null, rows, count, page, size);    

    } catch (e) {
        console.log('ERROR EN LINEA', e);
        return responses.errorDTOResponse(res,500,"Error del servidor al obtener el ranking global");
    }

});


module.exports = router;