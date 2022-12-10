const router = require('express').Router();
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const { User }= require('../../databases/db');
const bcrypt = require('bcrypt');

//endpoint para listar usuarios
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const users = await User.findAndCountAll(options);
    res.status(200).json({message: 'Lista de usuarios', users });
});

//endpoint para crear usuarios
router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('role','El rol es obligatorio').not().isEmpty(),
    check('email','El email debe ser correcto').isEmail(),
    check('password','El password es obligatorio').not().isEmpty()
], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errores:errors.array()})
    }

    req.body.password = bcrypt.hashSync(req.body.password,10);

    const verifyEmail= await User.findOne({where:{email:req.body.email}});
    if(verifyEmail){
        res.json({error:'No puede usar un email registrado'});
    }else{
        const verifyName= await User.findOne({where:{name:req.body.name}});
        if(verifyName){
            res.json({error:'No puede usar un nombre registrado'});
        }else{
            const user = await User.create(req.body);
            res.status(200).json({message:'Usuario creado', user });
        }
    }
});

//endpoint para editar usuarios
router.put('/:userId',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('role','El rol es obligatorio').not().isEmpty(),
    check('email','El email debe ser correcto').isEmail(),
    check('password','El password es obligatorio').not().isEmpty()
], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errores:errors.array()})
    }

    req.body.password = bcrypt.hashSync(req.body.password,10);

    const verifyEmail= await User.findOne({where:{email:req.body.email}});
    if(verifyEmail){
        res.json({error:'No puede usar un email registrado'});
    }else{
        const verifyName= await User.findOne({where:{name:req.body.name}});
        if(verifyName){
            res.json({error:'No puede usar un nombre registrado'});
        }else{
            await User.update(req.body,{
                where:{ id: req.params.userId}
            });
            res.status(200).json({ success: true, message:'Se ha modificado'});
        }
    }
});

router.delete('/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.status(200).json({ success: true, message:'Se ha eliminado'});
});

module.exports = router;
