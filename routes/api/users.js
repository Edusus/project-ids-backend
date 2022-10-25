const router = require('express').Router();
 
const { User }= require('../../dataBase');

router.get('/', async (req,res)=>{

    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };

    const users = await User.findAll(options);

    res.json(users);
});

//endpoint para crear usuarios
router.post('/', async (req,res)=>{
    const user = await User.create(req.body);
    res.json(user);
});

//endpoint para editar usuarios
router.put('/:userId', async (req,res)=>{
    await User.update(req.body,{
        where:{ id: req.params.userId}
    });
    res.json({ success: true, message:'Se ha modificado'});
});

router.delete('/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.json({ success: true, message:'Se ha eliminado'});
});

module.exports = router;