const router= require('express').Router();

const { Event,money }= require('../../databases/db');

////endpoint para listar eventos activos
router.get('/', async (req,res)=>{
    const eventsPublics= await Event.findAll({where:{"status":true}});
     if(eventsPublics==''){
        res.json({error:'No existen eventos activos'});
    }else{
        res.status(200).json({
            "active items ": eventsPublics 
        });
    }

});

module.exports = router;