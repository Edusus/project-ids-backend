const router= require('express').Router();
const {team} = require('../../databases/db');
const { Event }= require('../../controllers/teams/finder');
const { game }= require('../../databases/db');
const  responses =require('../../utils/responses/responses');
const { Any } = require('typeorm');
//endpoint para listar eventos
router.get('/', async (req,res)=>{
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
            pages:Math.ceil(count/size),
            perPage:size
        },
        items: rows
    });
});

router.get('/all', async (req,res)=>{
    const items = await Event.findAll();
    res.status(200).json({
        items:items
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
            "active items ": eventsAvailable 
        });
    }

});

////endpoint para listar eventos inactivos
router.get('/inactive', async (req,res)=>{
    const eventsInactive= await Event.findAll({where:{"status":false}});
     if(eventsInactive==''){
        res.json({error:'No existen eventos inactivos'});
    }else{
        res.status(200).json({
            success: true,
            "inactive items": eventsInactive 
        });
    }

});

//endpoint para crear eventos
router.post('/', async (req,res)=>{
    const item = await Event.create(req.body);
    res.json({
        message:'item creado',
        item 
    });
});

//endpoint para editar eventos
router.put('/:eventId', async (req,res)=>{
    await Event.update(req.body,{
        where:{ id: req.params.eventId}
    });
    res.json({ 
        success:true,
        message:"Modificación exitosa"
    });
});

//endpoint para borrar eventos
router.delete('/:eventId', async (req,res)=>{
  //  if(eventId != await team && eventid != await game.){
        await Event.destroy({
            where:{ id: req.params.eventId }
        });
        return responses.successDTOResponse(res,true,"se ha eliminado con exito");
  //  }
});


module.exports=router;