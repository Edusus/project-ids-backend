const router = require('express').Router();
 
const { User }= require('../../dataBase');

router.get('/users', async (req,res)=>{
    const users = await User.findAll();
    res.json(users);
});

//endpoint para crear usuarios
router.post('/users', async (req,res)=>{
    const user = await User.create(req.body);
    res.json(user);
});

//endpoint para editar usuarios
router.put('/users/:userId', async (req,res)=>{
    await User.update(req.body,{
        where:{ id: req.params.userId}
    });
    res.json({ success: true, message:'Se ha modificado'});
});

router.delete('/users/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.json({ success: true, message:'Se ha eliminado'});
});

module.exports = router;