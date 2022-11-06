const router = require('express').Router();
 
const { User }= require('../../databases/db');

router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const users = await User.findAll(options);
    res.status(200).json({message: 'Lista de usuarios', users });
});

//endpoint para crear usuarios
router.post('/', async (req,res)=>{
    const user = await User.create(req.body);
    res.status(200).json({message:'Usuario creado', user });
});

//endpoint para editar usuarios
router.put('/:userId', async (req,res)=>{
    await User.update(req.body,{
        where:{ id: req.params.userId}
    });
    res.status(200).json({ success: true, message:'Se ha modificado'});
});

router.delete('/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.status(200).json({ success: true, message:'Se ha eliminado'});
});

module.exports = router;
