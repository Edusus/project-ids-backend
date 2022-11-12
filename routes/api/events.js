const router= require('express').Router();

const { Event }= require('../../dataBase/db');

//endpoint para listar eventos
router.get('/', async (req,res)=>{
    const events = await Event.findAll();
    res.json(events);
});

//endpoint para crear eventos
router.post('/', async (req,res)=>{
    const event = await Event.create(req.body);
    res.json(event);
});

//endpoint para editar eventos
router.put('/:eventId', async (req,res)=>{
    await Event.update(req.body,{
        where:{ id: req.params.eventId}
    });
    res.json({ success:'Se ha modificado'});
});

//endpoint para borrar eventos
router.delete('/:eventId', async (req,res)=>{
    await Event.destroy({
        where:{ id: req.params.eventId}
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports=router;