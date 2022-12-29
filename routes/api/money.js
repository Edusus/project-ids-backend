const router= require('express').Router();

const { Event, money, Op }= require('../../databases/db');

////endpoint para listar eventos activos
router.get('/', async (req,res)=>{

    const eventsPublics= await Event.findAll({
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
        console.log(eventUsers);
    }

});

module.exports = router;