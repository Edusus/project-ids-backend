const router = require('express').Router();

const { Sticker, random, Op, team, inventory } = require('../../databases/db');

const controllerFile = require('../../controller/upload');
const controllerSticker = require('../../controller/uploadStickers')
const auth = require('../../middlewares/auth');

//endpoint para listar cromos
router.get('/',auth, async (req,res)=>{  
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const stickers = await Sticker.findAndCountAll({
      options,
      attributes: ['id','playerName', 'country', 'position', 'img', 'height', 'weight', 'appearanceRate', 'createdAt', 'updatedAt'],
      include: {
        model: team,
        attributes: ['id', 'name', 'badge']
      }
    });
    res.status(200).json({message: 'Lista de cromos', stickers});
});

//endpoint para obtener 5 cromos al azar
router.get('/obtain/:eventId',auth, async (req, res) => {
  if (await Sticker.findOne()) {
    const stickers = [];
    let appearanceRate = 0;
    let singleSticker;
    do {
      do {
        appearanceRate = Math.random()*100;
        singleSticker = await Sticker.findOne({
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
      } while (!singleSticker)
      
     let idSticker = singleSticker.dataValues.id
     const idUser = req.user.id.id;

      inventory.findOne({
        where: {
          [Op.and]: [{stickerId: idSticker},{eventId : req.params.eventId}]
        }
     }).then(inventorys => {
         if(!inventorys) {
                inventory.create({
                isInAlbum: false,
                Quantity: 1,
                userId: idUser,
                stickerId: idSticker,
                eventId: req.params.eventId
               });
         } else {
            const quant = inventorys.dataValues.Quantity;
              inventory.update({
              Quantity : quant+1,
             },{
              where:{
                [Op.and]: [{stickerId: idSticker},{userId : idUser},{eventId: req.params.eventId}]
               }
            })
          }
    });
      
      stickers.push(singleSticker);

    } while (stickers.length < 5)
    res.status(200).json({
      success: true,
      stickers : stickers
    }) 
  } else {
    console.error('NO STICKERS IN DB');
    res.status(500).send('Servicio en mantenimiento...');
  }
});

//endpoint para crear cromos
router.post('/', controllerFile.upload, controllerSticker.uploadFileSticker);

//endpoint para editar cromos
router.put('/:playerId', controllerFile.upload, controllerSticker.uploadUpdatedFileSticker);

//endpoint para borrar cromos
router.delete('/:playerId', async (req,res)=>{
    await Sticker.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports = router;