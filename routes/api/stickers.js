const router = require('express').Router();

const { Sticker, random, Op, team, inventory, Event } = require('../../databases/db');
const {imgController} = require('../../controllers/filesControllers');
const controllerSticker = require('../../controllers/stickers/uploadStickers')
const { verifyToken, isAdmin } = require('../../middlewares/auth');

//endpoint para listar cromos
router.get('/', async (req,res)=>{  
  //paginacion
  let {page = 0, size = 10 } = req.query;
  const [pageAsNumber, sizeAsNumber] = [Number.parseInt(page), Number.parseInt(size)];
  let options = {
    limit: sizeAsNumber,
    offset: pageAsNumber * sizeAsNumber,
    attributes: ['id','playerName', 'country', 'position', 'img', 'height', 'weight', 'appearanceRate', 'createdAt', 'updatedAt'],
    include: {
      model: team,
      attributes: ['id', 'name', 'badge'],
      include: {
        model: Event,
        attributes: ['id', 'eventName']
      }
    }
  }
  const {count,rows} = await Sticker.findAndCountAll(options);
  res.status(200).json({
    success: true,
    paginate:{
      total: count,
      page: pageAsNumber,
      pages: Math.ceil(count/sizeAsNumber),
      perPage: sizeAsNumber
    },
    items: rows
});
});

//endpoint para obtener 5 cromos al azar
router.get('/obtain/:eventId', async (req, res) => {
  if (await Sticker.findOne()) {
    const stickers = [];
    const idUser = req.user.id.id;
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
      
      await inventory.findOne({
        where: {
          [Op.and]: [{stickerId: singleSticker.dataValues.id},{eventId : req.params.eventId},{userId: idUser}]
        }
     }).then( async inventorys => {
         if(!inventorys) {
                await inventory.create({
                isInAlbum: false,
                Quantity: 1,
                userId: idUser,
                stickerId: singleSticker.dataValues.id,
                eventId: req.params.eventId
               });
         } else {
            const quant = inventorys.dataValues.Quantity;
              await inventory.update({
              Quantity : quant+1,
             },{
              where:{
                [Op.and]: [{stickerId: singleSticker.dataValues.id},{userId : idUser},{eventId: req.params.eventId}]
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
router.post('/', isAdmin, imgController.uploadImg, controllerSticker.uploadFileSticker);

//endpoint para editar cromos
router.put('/:playerId', isAdmin, imgController.uploadImg, controllerSticker.uploadUpdatedFileSticker);

//endpoint para borrar cromos
router.delete('/:playerId', isAdmin, async (req,res)=>{
    await Sticker.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ 
      success:true, 
      message:"item deleted"
    });
});


module.exports = router;