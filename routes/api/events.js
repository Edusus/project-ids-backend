const router= require('express').Router();

const { Event }= require('../../databases/db');
const { verifyToken, isAdmin } = require('../../middlewares/auth');

//endpoint para listar eventos
router.get('/',isAdmin, async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const {count,rows} = await Event.findAndCountAll(options);
    res.status(200).json({
        success: true,
        paginate:{
            total:count,
            page:page,
            pages:Math.trunc(count/size),
            perPage:size
        },
        Items: rows
    });
});

////endpoint para listar eventos activos
router.get('/active', async (req,res)=>{
    const eventsAvailable= await Event.findAll({where:{"status":true}});
     if(eventsAvailable==''){
        res.json({error:'No existen eventos activos'});
    }else{
        res.status(200).json({
            success: true,
            "Active items ": eventsAvailable 
        });
    }

});

////endpoint para listar eventos inactivos
router.get('/all',isAdmin, async (req,res)=>{
    const eventsInactive= await Event.findAll({where:{"status":false}});
     if(eventsInactive==''){
        res.json({error:'No existen eventos inactivos'});
    }else{
        res.status(200).json({
            success: true,
            "Inactive items": eventsInactive 
        });
    }

});

//endpoint para crear eventos
router.post('/',isAdmin, async (req,res)=>{
    const Item = await Event.create(req.body);
    res.json({
        message:'Item creado',
        Item 
    });
});

//endpoint para editar eventos
router.put('/:eventId',isAdmin, async (req,res)=>{
    await Event.update(req.body,{
        where:{ id: req.params.eventId}
    });
    res.json({ 
        success:true,
        message:"Modificación exitosa"
    });
});

//endpoint para borrar eventos
router.delete('/:eventId',isAdmin, async (req,res)=>{
    await Event.destroy({
        where:{ id: req.params.eventId}
    });
    res.json({ 
        success:true,
        message:"Eliminación exitosa"
    });
});


module.exports=router;