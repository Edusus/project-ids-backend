const router= require('express').Router();
const responses= require('../../utils/responses/responses');
const { Event, PlayerFantasy, Op }= require('../../databases/db');
const responses = require('../../utils/responses/responses');

////endpoint para listar eventos en los que pueda participar el usuario(en los que no esté participando)
router.get('/', async (req,res) => {

    const eventsPublics = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'status']
         },
        raw:true,
        where:{"status":true}
    });

    const eventUser = eventsPublics.map(async function(element) {
        const moneyEvent = await PlayerFantasy.findOne({
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
        if (!moneyEvent) {
            element.imAlreadyPlayingIn = false;
        } else {
            element.imAlreadyPlayingIn = true;
        }
        return element;
    });

    const eventUsers = await Promise.all(eventUser);
    return responses.multipleDTOsResponse(res, 200, 'Competiciones recuperadas con exito', eventUsers);
});

//Endpoint para regresar el dinero y puntaje del jugador
router.get('/:eventId', async (req,res)=>{
    const event = await Event.findOne({
        where: {id : req.params.eventId}
    });
    if (!event) {
        return responses.errorDTOResponse(res,404,"Evento no encontrado");
    }
    const user = await PlayerFantasy.findOne({
        raw:true,
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'id','userId','eventId']
        },
        where: {
            [Op.and]:[{
                eventId : req.params.eventId
            },
            {
                userId : req.user.id.id
            }]
        }
    });

    if (!user) {
        return responses.errorDTOResponse(res,404,"El usuario no esta participando en ese evento");
    }

    return res.status(200).json({
        success: true,
        points: user.points,
        money: user.money
    });
});

router.post('/:eventId/join-game', async (req,res)=>{
    const event = await Event.findOne({
        raw:true,
        where: {id : req.params.eventId}
    });
    if (!event) {
        return responses.errorDTOResponse(res,404,"Evento no encontrado");
    }

    if(event.status == false){
        return responses.errorDTOResponse(res,403,"Este evento no esta activo");
    }

    const user = await PlayerFantasy.findOne({
        raw:true,
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'id','userId','eventId']
        },
        where: {
            [Op.and]:[{
                eventId : req.params.eventId
            },
            {
                userId : req.user.id.id
            }]
        }
    });

    if (user) {
        return responses(res,409,"Ya estas participando en ese evento");
    }
    await PlayerFantasy.create({
        eventId: req.params.eventId,
        userId: req.user.id.id,
        points: 0,
        money: 0
    });

    return responses.successDTOResponse(res,200,"Felicidades te has unido al fantasy "+event.eventName);
});

module.exports = router;