const router = require('express').Router();

const { Chrome }= require('../../databases/db');

const controller = require('../../controller/upload');

//endpoint para listar cromos
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const stickers = await Chrome.findAll(options);
    res.status(200).json({message: 'Lista de cromos', stickers});
});

//endpoint para crear cromos
router.post('/', controller.upload, controller.uploadFileSticker);

//endpoint para editar cromos
router.put('/:playerId', async (req,res)=>{
    await Chrome.update(req.body,{
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha modificado'});
});

//endpoint para borrar cromos
router.delete('/:playerId', async (req,res)=>{
    await Chrome.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports = router;