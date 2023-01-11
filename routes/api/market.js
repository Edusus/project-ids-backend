const router = require('express').Router();
const { poster, posterBid } = require('../../controllers/market/poster');
const { bidUpdate } = require('../../controllers/market/updater');
const { Market,Bid,Op, Sticker, Team, User, Event, PlayerFantasy } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

router.get('/', async(req,res)=>{
    let {page = 0, size = 10, myAuction = false, teamId = '%', playername: playerName = '.*', position = ['goalkeeper', 'defender', 'forward', 'midfielder'] } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
     if (myAuction === 'true') {
        let options = {
            limit: sizeAsNumber,
            offset: pageAsNumber * sizeAsNumber,
            include: {
                model: Sticker,
                where: {
                    playerName: {
                      [Op.regexp]: playerName
                    },
                    position
                  },
                include: {
                    model: Team,
                    where : {
                        id : {
                            [Op.like]: teamId
                          }
                    }
                }
            },
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                isFinished: false,
                userId: req.user.id.id
            }
        };
        const { count, rows } = await Market.findAndCountAll(options);
        return responses.paginatedDTOsResponse(res, 200, 'Subastas recuperadas con exito', rows, count, pageAsNumber, sizeAsNumber);

     } else {    
        let options = {
            limit: sizeAsNumber,
            offset: pageAsNumber * sizeAsNumber,
            include: {
                model: Sticker,
                where: {
                    playerName: {
                      [Op.regexp]: playerName
                    },
                    position
                  },
                include: {
                    model: Team,
                    where : {
                        id : {
                            [Op.like]: teamId
                          }
                    }
                }
            },
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                isFinished: false,
                userId: {
                    [Op.not]: Number.parseInt(req.user.id.id)
                }
            }
        };
     
        const { count, rows } = await Market.findAndCountAll(options);
        return responses.paginatedDTOsResponse(res, 200, 'Subastas recuperadas con exito', rows, count, pageAsNumber, sizeAsNumber);
    }
    
});

router.get('/myBids', async(req,res) =>{ 
    let {page = 0, size = 10, myAuction = false, teamId = '%', playername: playerName = '.*', position = ['goalkeeper', 'defender', 'forward', 'midfielder'] } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
     let options = {
         limit: sizeAsNumber,
         offset: pageAsNumber * sizeAsNumber,
         order: [
             ['createdAt', 'DESC']
         ],
         where: {
             userId: req.user.id.id
         },
         include : [{
             model: User,
             attributes: ['id', 'name']
         },
         {
             model: Market,
             attributes: {
                 exclude: ['undefined']
             },
             where: {
                 isFinished: false
             },
             include : [{
                model: Sticker,
                where: {
                    playerName: {
                        [Op.regexp]: playerName
                    },
                position
                },
                include: {
                    model: Team,
                    where : {
                        id : {
                                [Op.like]: teamId
                        }
                    }
                }
            }]
         }
        ]
     };
 
     const { count, rows } = await Bid.findAndCountAll(options);
 
     if(!rows){
         return responses.errorDTOResponse(res, 404, 'No tienes pujas');
     }
 
     const bid = JSON.parse(JSON.stringify(rows));
     const items = [];
     for (let i = 0; i < bid.length; i++) {
         items.push(bid[i]);
     }
 
    return responses.paginatedDTOsResponse(res, 200, 'Ofertas recuperadas con exito', items, count, pageAsNumber, sizeAsNumber);
});

// Endpoint para buscar subastas por su ID
router.get('/:auctionId', async (req,res) => {
    const market = await Market.findOne({
        include: [
            {
                model: Sticker,
                attributes: ['id', 'playerName', 'img'],
            },
            { 
                model: User,
                attributes: ['id', 'name']
            },
            {
                model: Event,
                attributes: ['id', 'eventName']
            }
        ],
        where:{id: req.params.auctionId}
    });

    if  (!market) {
        return responses.errorDTOResponse(res, 404, 'Subasta no encontrada');
    }

    // Para saber la puja más alta de la subasta  
    const marketBid = await Bid.findAll({ 
        raw: true,
        where: { marketId: req.params.auctionId },
    });
    const items = [ ...marketBid ];
    const max = Math.max.apply(Math, items.map((o) => o.value));
    const winner = items.find(item => item.value === max);

    
    let highestBid = null;
    if (winner) {
        const user = await market.getUser({ raw: true });

        highestBid = {
            ...winner,
            id: winner.id,
            value: winner.value,
            buyer: {
                id: user.id, //<---- el user es el que no enccuentra
                name: user.name //<--- el user es el que no encuentra
            }
        };
    }

    // Para saber la última puja del usuario
    const userBid = await Bid.findOne({
        raw: true,
        where: {
            [Op.and]:[{
                marketId : req.params.auctionId
            },
            {
                userId : req.user.id.id
            }]
        }
    });

    let myLastBid = null;
    if (userBid) {
        myLastBid = {
            id: userBid.id,
            value: userBid.value,
        };
    }

    return res.status(200).json({
        success: true,
        message: "Subasta recuperada con éxito",
        item: {
            market: market.dataValues,
            highestBid,
            myLastBid
        }
    });
});

  
router.post('/add', poster);

router.post('/bid', posterBid);

router.put('/update/:bidId', bidUpdate);

module.exports = router;
