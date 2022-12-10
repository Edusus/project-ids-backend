const router = require('express').Router();

const { Item, random, Op, team, inventory } = require('../../databases/db');

const controllerFile = require('../../controller/upload');
const controllerItem = require('../../controller/uploadItems')
const { verifyToken, isAdmin } = require('../../middlewares/auth');

//endpoint para listar cromos
router.get('/',isAdmin, async (req,res)=>{  
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const items = await Item.findAndCountAll({
      options,
      attributes: ['id','playerName', 'country', 'position', 'img', 'height', 'weight', 'appearanceRate', 'createdAt', 'updatedAt'],
      include: {
        model: team,
        attributes: ['id', 'name', 'badge']
      }
    });
    res.status(200).json({message: 'Lista de cromos', items});
});

//endpoint para obtener 5 cromos al azar
router.get('/obtain/:eventId', async (req, res) => {
  if (await Item.findOne()) {
    const items = [];
    const idUser = req.user.id.id;
    let appearanceRate = 0;
    let singleItem;
    do {
      do {
        appearanceRate = Math.random()*100;
        singleItem = await Item.findOne({
          order: random,
          attributes: ['id','playerName', 'country', 'position', 'img', 'height', 'weight', 'appearanceRate', 'createdAt', 'updatedAt'],
          include : {
            model: team,
            attributes: ['name', 'badge']
          },
          where: {
            appearanceRate: {
              [Op.gte]: appearanceRate
            }
          }
        });
      } while (!singleItem)
      
      await inventory.findOne({
        where: {
          [Op.and]: [{itemId: singleItem.dataValues.id},{eventId : req.params.eventId},{userId: idUser}]
        }
     }).then( async inventorys => {
         if(!inventorys) {
                await inventory.create({
                isInAlbum: false,
                Quantity: 1,
                userId: idUser,
                itemId: singleItem.dataValues.id,
                eventId: req.params.eventId
               });
         } else {
            const quant = inventorys.dataValues.Quantity;
              await inventory.update({
              Quantity : quant+1,
             },{
              where:{
                [Op.and]: [{itemId: singleItem.dataValues.id},{userId : idUser},{eventId: req.params.eventId}]
               }
            })
          }
    });
      
      items.push(singleItem);

    } while (items.length < 5)
    res.status(200).json({
      success: true,
      items : items
    }) 
  } else {
    console.error('NO ITEMS IN DB');
    res.status(500).send('Servicio en mantenimiento...');
  }
});

//endpoint para crear cromos
router.post('/',isAdmin, controllerFile.upload, controllerItem.uploadFileItem);

//endpoint para editar cromos
router.put('/:playerId',isAdmin, controllerFile.upload, controllerItem.uploadUpdatedFileItem);

//endpoint para borrar cromos
router.delete('/:playerId',isAdmin, async (req,res)=>{
    await Item.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ success:true,message:'Se ha eliminado'});
});


module.exports = router;