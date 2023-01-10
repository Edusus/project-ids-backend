const router = require('express').Router();
const responses = require('../../utils/responses/responses');
const { rankingDTOPaginate } = require('../../controllers/ranking/utils');
const { User, PlayerFantasy, Event, Op} = require('../../databases/db');
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
            ['updatedAt', 'ASC']
        ],
        attributes: [
            "id", "points", "userId", "eventId",
            [Sequelize.literal('RANK() OVER (ORDER BY points DESC, updatedAt ASC)'), 'rank']
        ],
        where: { 
            eventId: eventId,
        },
        include : {
            model: User,
            attributes: ['name']
        }
    };

    const { count, rows } = await PlayerFantasy.findAndCountAll({
        limit: +size,
        offset: (+page) * (+size),
        ...options,
    });

    const myPosition = await PlayerFantasy.findOne({
        ...options,
        having: {
            userId: req.user.id.id
        }
    });

    return rankingDTOPaginate(res, 200, 'Ranking global', myPosition || null, rows, count, page, size);
    
});


module.exports = router;