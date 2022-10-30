const router=require('express').Router();

const { Chrome }= require('../../dataBase');

//endpoint para listar cromos
router.get('/', async (req,res)=>{
    const chromes = await Chrome.findAll();
    res.json(chromes);
});

//endpoint para crear cromos
router.post('/', async (req,res)=>{
    const chrome = await Chrome.create(req.body);
    res.json(chrome);
});

//endpoint para editar cromos
router.put('/:playerName', async (req,res)=>{
    await Chrome.update(req.body,{
        where:{ playerName: req.params.playerName}
    });
    res.json({ success:'Se ha modificado'});
});

//endpoint para borrar cromos
router.delete('/:playerName', async (req,res)=>{
    await Chrome.destroy({
        where:{ playerName: req.params.playerName}
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports=router;