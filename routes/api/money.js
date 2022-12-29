const router= require('express').Router();

const { Event, money, Op }= require('../../databases/db');

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
        res.json({error:'No existen eventos activos'});
    }else{
        const eventUser = eventsPublics.map(async function(element) {
            const moneyEvent = await money.findOne({
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
        const user = await money.findOne({
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
                points:user.points,
                money:user.money
            })
        }
    }
});

module.exports = router;