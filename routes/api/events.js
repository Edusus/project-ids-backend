const router= require('express').Router();

const { Event }= require('../../databases/db');

//endpoint para listar eventos
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const events = await Event.findAndCountAll(options);
    res.status(200).json(events);
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