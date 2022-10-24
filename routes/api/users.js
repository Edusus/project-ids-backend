const router = require('express').Router();
 
const { User }= require('../../dataBase');

router.get('/', async (req,res)=>{
    const users = await User.findAll();
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
    res.json({ success:'Se ha modificado'});
});

router.delete('/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.json({ success:'Se ha eliminado'});
});

module.exports = router;