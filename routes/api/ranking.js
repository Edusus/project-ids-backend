const router = require('express').Router();
const responses = require('../../utils/responses/responses');
const { rankingDTOPaginate } = require('../../controllers/ranking/utils');
const { User, PlayerFantasy, Event, Op} = require('../../databases/db');

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
        limit: +size,
        offset: (+page) * (+size),
        raws:true,
        order: [
            ['points', 'DESC']
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt','eventId','money']
        },
        where: { 
            eventId: eventId
        },
        include : {
            model: User,
            attributes: ['name']
        }
    };

    const { count, rows } = await PlayerFantasy.findAndCountAll(options);
    let counter = 0;
    const position = JSON.parse(JSON.stringify(rows));
    const items = [];
     for (let i = 0; i < position.length; i++) {
         items.push(position[i]);
     }

    items.forEach(element => {
        element.user.position = counter + 1;
        counter++;
    });

    let myPosition = {
        user: null,
        points: null,
        position: null
    };
        items.forEach(element => {
            if(element.userId == req.user.id.id){
                myPosition.user = element.user.name;
                myPosition.points = element.points;
                myPosition.position = element.user.position;
            }
    })

    
    return rankingDTOPaginate(res, 200, 'Ranking global', myPosition, items, count, page, size);
    
});


module.exports = router;