const router= require('express').Router();
const  responses =require('../../utils/responses/responses');
const { User, PlayerFantasy, Event, Op} = require('../../databases/db');

router.get('/:userId', async (req,res)=>{
    const event = await Event.findOne({
        raw:true,
        where: {id : req.params.eventId}
    });
    if (!event) {
        return responses.errorDTOResponse(res,404,"Evento no encontrado");
    }

    const { page = 0, size = 10 } = req.query;
    let options = {
        limit: +size,
        offset: (+page) * (+size),
        raw:true,
        order: [
            ['points', 'DESC']
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'id','eventId','money']
        },
        where: { 
            eventId:req.params.eventId 
        },
        include : {
            model: User,
            attributes: ['name']
        }
    };

    const { count, rows } = await PlayerFantasy.findAndCountAll(options);
    let counter=0;
    const user = rows.map(async function(element) {
        counter+1;
        const userInRanking = await PlayerFantasy.findOne({
            raw: true,
            where: {
                [Op.and]: [{
                    eventId: element.id
                },
                {
                    userId: req.user.id.id
                }]
            }
        });
        if (!userInRanking) {
            return responses.errorDTOResponse(res,400,'Usted no está participando') ;
        }
        return counter;
    });
    const users = await Promise.all(user);

    return responses.paginatedDTOsResponse(res, 200, 'Ranking global', users, count, page, size);
});

module.exports = router;