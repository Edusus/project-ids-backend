const router= require('express').Router();
const { Team, Game, Event } = require('../../databases/db');
const  responses =require('../../utils/responses/responses');
const { Any } = require('typeorm');
const { verifyToken, isAdmin } = require('../../middlewares/auth');

// Endpoint para listar eventos
router.get('/', async (req,res)=>{
    // Paginacion
    const { page = 0, size = 10 } = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };

    const { count, rows } = await Event.findAndCountAll(options);

    return res.status(200).json({
        success: true,
        message: "Eventos recuperados con éxito",
        paginate:{
          total: count,
          page,
          pages: Math.ceil(count/size),
          perPage: size
        },
        items: rows
    });
});

router.get('/all', async (req, res)=>{
    try {
        const items = await Event.findAll();
        responses.multipleDTOsResponse(res,200,"se han recibido con exito los eventos",items);
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }
});

// Endpoint para listar eventos activos
router.get('/active', async (req, res)=>{
    try {
        const eventsAvailable= await Event.findAll({ where:{"status":true} });
        return responses.multipleDTOsResponse(res, 200, "Competiciones activas recuperadas con exito!", eventsAvailable);
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }
});

// Endpoint para listar eventos inactivos
router.get('/inactive', async (req, res)=>{
    try {
        const eventsInactive= await Event.findAll({ where:{"status":false} });
        return responses.multipleDTOsResponse(res, 200, "Competiciones inactivas recuperadas con exito!", eventsInactive);
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }
});

// Endpoint para obtener eventos por id
router.get('/:eventId', isAdmin, async (req, res) => {
    if (isNaN(req.params.eventId)) {
        return responses.errorDTOResponse(res, 400, "El ID debe ser un número");
    }

    const event = await Event.findOne({
        where:{id: req.params.eventId}
    });

    if(!event){
        return responses.errorDTOResponse(res, 404, "No existe evento con este id");
    }

    return responses.singleDTOResponse(res,200,"Evento recuperado con éxito",event);
});

// Endpoint para crear eventos
router.post('/',isAdmin, async (req, res)=>{
    try {
        const item = await Event.create(req.body);
        return responses.singleDTOResponse(res, 200,"Competicion creada", item);
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }
});

// Endpoint para editar eventos
router.put('/:eventId', isAdmin, async (req, res)=>{
    try {
        await Event.update(req.body,{
            where:{ id: req.params.eventId }
        });
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }
    return responses.successDTOResponse(res,200,"Modificacion exitosa");
});

// Endpoint para borrar eventos
router.delete('/:eventId', async (req, res)=>{
    const team = await Team.findOne({
        raw: true,
        where: { idEvents : req.params.eventId }
    });
    const game = await Game.findOne({
        raw: true,
        where: { eventId : req.params.eventId }
    });

    if (team || game) {
        return responses.errorDTOResponse(res, 400, "No se puede eliminar el evento porque tiene equipos o partidos asociados");
    }

    try {
        await Event.destroy({ where:{ id: req.params.eventId } });
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }

    return responses.successDTOResponse(res, 200, "Se ha eliminado con exito");
});

module.exports = router;
