const router= require('express').Router();
const {team} = require('../../databases/db');
const { Event }= require('../../controllers/teams/finder');
const { game }= require('../../databases/db');
const  responses =require('../../utils/responses/responses');
const { Any } = require('typeorm');
const { verifyToken, isAdmin } = require('../../middlewares/auth');
const responses= require('../../utils/responses/responses');

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
    responses.multipleDTOsResponse(res,200,"se han recibido con exito los eventos",items);
});

////endpoint para listar eventos activos
router.get('/active', async (req,res)=>{
    const eventsAvailable= await Event.findAll({where:{"status":true}});
     if(eventsAvailable==''){
        responses.errorDTOResponse(res,400,'No existen eventos activos');
    }else{
        responses.multipleDTOsResponse(res,200,"active items "+ eventsAvailable );
    }
});

////endpoint para listar eventos inactivos
router.get('/items', async (req,res)=>{
    const items= await Event.findAll({where:{"status":false}});
     if(items==''){
        responses.errorDTOResponse(res,400,'No existen eventos inactivos');
    }else{
        responses.multipleDTOsResponse(res,200,"inactive items"+ items);
    }
});

//endpoint para crear eventos
router.post('/',isAdmin, async (req,res)=>{
    const item = await Event.create(req.body);
    responses.singleDTOResponse(res,200,'item creado',item);
});

//endpoint para editar eventos
router.put('/:eventId',isAdmin, async (req,res)=>{
    await Event.update(req.body,{
        where:{ id: req.params.eventId}
    });
    responses.successDTOResponse(res,200,"Modificación exitosa");
});

//endpoint para borrar eventos
router.delete('/:eventId', async (req,res)=>{
    const team = await team.findOne({
        raw:true,
        where: {eventId : req.params.eventId}
    });
    const game = await game.findOne({
        raw:true,
        where: {eventId : req.params.eventid}
    });    
    if (team || game) {
        return responses.errorDTOResponse(res, 400, "No se puede eliminar el evento porque tiene equipos o partidos asociados");
    }else{
        await Event.destroy({
            where:{ id: req.params.eventId }
        });
        return responses.successDTOResponse(res,true,"se ha eliminado con exito");
    }
});


module.exports=router;