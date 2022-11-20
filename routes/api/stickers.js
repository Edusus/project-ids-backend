const router = require('express').Router();

const { Sticker }= require('../../databases/db');

//endpoint para listar cromos
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const stickers = await Sticker.findAll(options);
    res.status(200).json({message: 'Lista de cromos', stickers});
});


//endpoint para crear cromos
router.post('/', async (req,res)=>{
    console.log(req.body);
    const sticker = await Sticker.create(req.body);
    res.json(sticker);
});

//endpoint para editar cromos
router.put('/:playerId', async (req,res)=>{
    await Sticker.update(req.body,{
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha modificado'});
});

//endpoint para borrar cromos
router.delete('/:playerId', async (req,res)=>{
    await Sticker.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports = router;