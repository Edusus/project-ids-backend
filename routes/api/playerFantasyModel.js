const router= require('express').Router();

const { Event, PlayerFantasy, Op }= require('../../databases/db');

////endpoint para listar eventos en los que pueda participar el usuario(en los que no esté participando)
router.get('/', async (req,res)=>{

    const eventsPublics= await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'status']
         },
        raw:true,
        where:{"status":true}
    });
     if(eventsPublics==''){
        res.json({
            succes:false,
            message:'No existen eventos activos'
        });
    }else{
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
        res.status(200).json(eventUsers);
    }

});

//Endpoint para regresar el dinero y puntaje del jugador
router.get('/:eventId', async (req,res)=>{
    const event = await Event.findOne({
        where: {id : req.params.eventId}
    });
    if (!event) {
        res.status(404).json({
            success: false,
            message: "Evento no encontrado"
        })
    }else{
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
            res.status(404).json({
                success: false,
                message: "El usuario no esta participando en ese evento"
            })
        }else{
            res.status(200).json({
                success: true,
                points: user.points,
                money: user.money
            })
        }
    }
});

router.post('/:eventId/join-game', async (req,res)=>{
    const event = await Event.findOne({
        raw:true,
        where: {id : req.params.eventId}
    });
    if (!event) {
        return res.status(404).json({
            success: false,
            message: "Evento no encontrado"
        });
    }

    if(event.status == false){
        return res.status(403).json({
            success: false,
            message: "Este evento no esta activo"
        })
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
        return res.status(409).json({
            success: false,
            message: "Ya estas participando en ese evento"
        })
    }
    await PlayerFantasy.create({
        eventId: req.params.eventId,
        userId: req.user.id.id,
        points: 0,
        money: 0
    });

    return res.status(200).json({
        success: true,
        message: "Felicidades te haz unido al fantasy "+event.eventName
    })
})

module.exports = router;