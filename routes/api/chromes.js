const router = require('express').Router();

const { Chrome }= require('../../databases/db');

//endpoint para listar cromos
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const users = await Chrome.findAll(options);
    res.status(200).json({message: 'Lista de usuarios', users });
});

//endpoint para recuperar el mayor id
router.get('/maxid', async (req, res) => {
  const maxid = await Chrome.max("id");
  res.status(200).json({
    message: 'El mayor id es ' + maxid, 
    id: maxid
  });
});

//endpoint para crear cromos
router.post('/', async (req,res)=>{
    const chrome = await Chrome.create(req.body);
    res.json(chrome);
});

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