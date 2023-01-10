const router = require('express').Router();
const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const { User }= require('../../databases/db');
const bcrypt = require('bcrypt');
const { isAdmin } = require('../../middlewares/auth');
const responses = require('../../utils/responses/responses');


//endpoint para listar usuarios
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const {count,rows} = await User.findAndCountAll(options);

    res.status(200).json({
        success: true,
        paginate:{
            total:count,
            page:page,
            pages: Math.ceil(count/size),
            perPage:size
        },
        items: rows
    });
});

//endpoint para buscar user por su id
router.get('/:userId',isAdmin, async (req,res)=>{
    if (isNaN(req.params.userId)) {
        return responses.errorDTOResponse(res, 400, "El ID debe ser un número");
    }
    const user= await User.findOne({
        where:{id: req.params.userId}
    });
     if(!user){
        return responses.errorDTOResponse(res, 404, "No existe usuario con este id");
    }
    return responses.singleDTOResponse(res,200,"Usuario recuperado con éxito",user);
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
            const item = await User.create(req.body);
            res.status(200).json({
                message:'item creado',
                item 
            });
        }
    }
});

//endpoint para editar usuarios
router.put('/:userId', async (req,res) =>{
        let { name = null, role = null, password = null } = req.body;
        const userPut = await User.findOne({
            raw:true,
            where: {
                id : req.params.userId
            }
        })
         
        if (!userPut) {
            res.status(403).json({
                success: true,
                message: "Usuario no encontrado"
            })
        } else {
            if (name == null){
                name = userPut.name
            }
            if (role == null){
                role = userPut.role
            }
            if (password == null){
                password = userPut.password
            } else {
                password = bcrypt.hashSync(password,10);
            }
            const selector = {  
                where : {
                    id : req.params.userId
                  }
            };
            await User.update({
               "name" : name,
               "role" : role,
               "password": password,
               },
                selector
               )
    
             res.status(200).json({
                success: true, message:'Se ha actualizado'
             });
        }
       
});

router.delete('/:userId', async (req,res)=>{
    await User.destroy({
        where:{ id: req.params.userId}
    });
    res.status(200).json({ success: true, message:'Se ha eliminado'});
});
//exportacion de usuarios
module.exports = router;
