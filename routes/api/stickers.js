const router = require('express').Router();

const { Sticker, random, Op } = require('../../databases/db');

const controller = require('../../controller/upload');

//endpoint para listar cromos
router.get('/', async (req,res)=>{
    //paginacion
    const {page = 0, size = 10} = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size)
    };
    const stickers = await Sticker.findAll(options);
    res.status(200).json({message: 'Lista de cromos', stickers});
});

//endpoint para obtener 5 cromos al azar
router.get('/obtain', async (req, res) => {
  if (await Sticker.findOne()) {
    const stickers = [];
    let appearanceRate = 0;
    let singleSticker;
    do {
      do {
        appearanceRate = Math.random()*100;
        singleSticker = await Sticker.findOne({
          order: random,
          where: {
            appearanceRate: {
              [Op.gte]: appearanceRate
            }
          }
        });
      } while (!singleSticker)

      stickers.push(singleSticker);

    } while (stickers.length < 5)
    res.status(200).json({
      "success": true,
      "stickers": stickers
    });
  } else {
    console.error('NO STICKERS IN DB AAAAAAAAAAAAAAAAAAAAAH');
    res.status(500).send('Servicio en mantenimiento...');
  }
});

//endpoint para crear cromos
router.post('/', controller.upload, controller.uploadFileSticker);

//endpoint para editar cromos
router.put('/:playerId', async (req,res)=>{
    await Sticker.update(req.body,{
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha modificado'});
});

//endpoint para borrar cromos
router.delete('/:playerId', async (req,res)=>{
    await Sticker.destroy({
        where:{ id: req.params.playerId }
    });
    res.json({ success:'Se ha eliminado'});
});


module.exports = router;