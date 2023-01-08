const router = require('express').Router();
const { poster, posterBid } = require('../../controllers/market/poster');
const { bidUpdate } = require('../../controllers/market/updater');
const { Market,Bid,Op, Sticker, Team } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

router.get('/', async(req,res)=>{
    let {page = 0, size = 10} = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    let options = {
        limit: sizeAsNumber,
        offset: pageAsNumber * sizeAsNumber,
        include: {
            model: Sticker,
            include: {
                model: Team
            }
        },
        order: [
            ['createdAt', 'DESC']
        ],
        where: {
            isFinished: false,
            [Op.ne]: { userId: req.user.id.id },
        }
    };

    const { count, rows } = await Market.findAndCountAll(options);

     responses.paginatedDTOsResponse(res, 200, 'Almacen recuperado con exito', items, count, pageAsNumber, sizeAsNumber);
});

//endpoint para buscar subastas por su id
router.get('/:marketId', async (req,res)=>{
    const market= await Market.findOne({where:{id: req.params.marketId}});
     if(!market){
        return res.json({
          success: false,
          error:'No existe esta subasta'
        });
    }
    
    //Para saber la puja más alta de la subasta  
    const marketBid = await Bid.findAll({
        raw:true,
        where:{marketId:req.params.marketId}
    });
    const user = JSON.parse(JSON.stringify(marketBid));
    const items = [];
    for (let i = 0; i < user.length; i++) {
        items.push(user[i]);
    }
    const max = Math.max.apply(Math, items.map(function(o) { return o.value; }))
    const winner = items.find(item => item.value === max);

    //Para saber la última puja del usuario
    const userBid = await Bid.findOne({
        raw:true,
        where: {
            [Op.and]:[{
                marketId : req.params.marketId
            },
            {
                userId : req.user.id.id
            }]
        }
    });
    
    return res.status(200).json({
        success: true,
        message:"Subasta recuperada con éxito",
        item:{
            market,
            highestBid:winner,
            myLastBid:userBid
        }
    });
  });

router.post('/add', poster);

router.post('/bid', posterBid);

router.put('/update/:bidId', bidUpdate);

module.exports = router;
