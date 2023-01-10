const router = require('express').Router();
const responses = require('../../utils/responses/responses');
const { Sticker, random, Op, Team, Inventory, Warehouse, Event } = require('../../databases/db');
const { imgController, csvController } = require('../../controllers/filesControllers');
const controllerSticker = require('../../controllers/stickers/uploadStickers');
const { poster } = require('../../controllers/stickersControllers');
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
      model: Team,
      attributes: ['id', 'name', 'badge'],
      include: {
        model: Event,
        attributes: ['id', 'eventName']
      }
    }
  }

  const { count, rows } = await Sticker.findAndCountAll(options);

  res.status(200).json({
    success: true,
    message: "Cromos recuperados con exito",
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
            model: Team,
            attributes: ['name', 'badge']
          },
          where: {
            appearanceRate: {
              [Op.gte]: appearanceRate
            }
          }
        });
      } while (!singleSticker)
      
      await Inventory.findOne({
        where: {
          [Op.and]: [{stickerId: singleSticker.dataValues.id},{eventId : req.params.eventId},{userId: idUser}]
        }
     }).then( async inventorys => {
         if(!inventorys) {
                await Inventory.create({
                isInAlbum: false,
                Quantity: 1,
                userId: idUser,
                stickerId: singleSticker.dataValues.id,
                eventId: req.params.eventId
               });
         } else {
            const quant = inventorys.dataValues.Quantity;
              await Inventory.update({
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
    return responses.multipleDTOsResponse(res,200,"Se han obtenido con exito los cromos", stickers); 
  } else {
    console.error('NO STICKERS IN DB');
    return responses.errorDTOResponse(res,500,'Servicio en mantenimiento...');
  }
});

//endpoint para buscar cromos por su id
router.get('/:stickerId',isAdmin, async (req,res)=>{
  if (isNaN(req.params.stickerId)){
    return responses.errorDTOResponse(res, 400, "El ID debe ser un número");
  }
  const sticker= await Sticker.findOne({
    where:{id: req.params.stickerId}
  });
   if(!sticker){
    return responses.errorDTOResponse(res, 404, "No existe cromo con este id");
  }
  return responses.singleDTOResponse(res,200,"Sticker recuperado con éxito",sticker);
});

//endpoint para crear cromos
router.post('/', isAdmin, imgController.uploadImg, controllerSticker.uploadFileSticker);

router.post('/system/massive-import', isAdmin, csvController.uploadCsv, poster.postMassive);

//endpoint para editar cromos
router.put('/:playerId', isAdmin, imgController.uploadImg, controllerSticker.uploadUpdatedFileSticker);

//endpoint para borrar cromos
router.delete('/:stickerId', isAdmin, async (req,res)=>{
    const inInventory = await Inventory.findOne({
      raw:true,
      where: {stickerId : req.params.stickerId}
    });
    if (inInventory) {
      return responses.errorDTOResponse(res, 400, "No se puede eliminar el cromo porque está en uso");
    }
    const inWarehouse = await Warehouse.findOne({
      raw:true,
      where: {stickerId : req.params.stickerId}
    });
    if (inWarehouse) {
      return responses.errorDTOResponse(res, 400, "No se puede eliminar el cromo porque está en uso");
    }
    try{
      await Sticker.destroy({
        where:{ id: req.params.stickerId }
      });
      return responses.successDTOResponse(res,200,"Cromo eliminado con éxito!");
    } catch (error) {
      return responses.errorDTOResponse(res, 400, error.message);
    }
});

module.exports = router;