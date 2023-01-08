const schedule = require('node-schedule');
const { Market, Warehouse, Bid, PlayerFantasy, Op } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

const poster = async (req, res) => {
    const userId = req.user.id.id;
    const eventId = req.eventId;
    const timeNow = new Date(Date.now());
    const endTime = new Date(timeNow.getTime() + 600000);
    let { initialValue, directPurchase } = req.body;
    const {playerId} = req.body
    const warehouse = await Warehouse.findOne({
        raw: true,
        where: {
            [Op.and]: [{
                stickerId: playerId
            }, {
                eventId: eventId
            },{ 
                userId: userId
            }]
        }
    });
    const quant = warehouse.quantity;

    if (!warehouse) {
        return responses.errorDTOResponse(res, 404, 'No posees este Sticker')
    }
    const isInLineup = warehouse.isInLineup;
    if (isInLineup) {
        return responses.errorDTOResponse(res, 403, 'Este sticker ya esta en la alineacion')
    }

    if (initialValue == null || directPurchase == null || playerId == null) {
      return responses.errorDTOResponse(res, 400, 'Debe proporcionar un valor inicial, un valor de compra directa y un playerId');
    }

    if (warehouse.quantity == 0) {
        return responses.errorDTOResponse(res, 403, 'No posees mas stickers de este tipo')
    }

        await Warehouse.update({
            quantity: quant - 1,
            isInLineup: warehouse.isInLineup,
            userId: userId,
            eventId: eventId,
            stickerId: playerId
        }, {
            where: {
                [Op.and]: [{
                    stickerId: playerId
                }, {
                    eventId: eventId
                },{
                    userId: userId
                }]
            }
        });
        const market = await Market.create({
            raw: true,
            initialPurchaseValue: initialValue,
            immediatePurchaseValue : directPurchase,
            stickerId: playerId,
            userId : userId,
            eventId : eventId,
            finishDate: endTime,
            isFinished: false
        });
        res.status(200).json({
            success: true,
            message: 'Subasta creada con exito',
            item: market
        });
        const job = schedule.scheduleJob(endTime, async function(){
            console.log('Subasta finalizada');
            market.isFinished = true;

            await market.update({
                isFinished: true
            });

            const bids = await Bid.findAll({
                raw: true,
                where: {
                    [Op.and]: [{
                        marketId: market.id
                    }]
                },
                order: [['value', 'DESC']
                ]
            });

            if (bids.length == 0) {
                console.log('No hay ofertas');
                await Warehouse.update({
                    quantity: quant,
                }, {
                    where: {
                        [Op.and]: [{
                            stickerId: playerId
                        },{
                            userId: userId
                        }]
                    }
                });
            } else {
                const user = JSON.parse(JSON.stringify(bids));
                const items = [];
                for (let i = 0; i < user.length; i++) {
                 items.push(user[i]);
                }                    
                const max = Math.max.apply(Math, items.map(function(o) { return o.value; }))
                const winner = items.find(item => item.value === max);
                const warehouseWinner = await Warehouse.findOne({
                    raw: true,
                    where: {
                        [Op.and]: [{
                            stickerId: playerId
                        }, {
                            userId: winner.userId
                        }]
                    }
                });

                const valueMax = items.shift();
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    let player = await PlayerFantasy.findOne({
                        raw: true,
                        where: {
                            [Op.and]: [{
                                userId: item.userId
                            }, {
                                eventId: eventId
                            }]
                        }
                    });

                    await PlayerFantasy.update({
                        money: player.money + item.value
                    }, {
                        where: {
                            [Op.and]: [{
                                userId: item.id
                            }, {
                                eventId: eventId
                            }]
                        }
                    });
                }

                let auctioner = await PlayerFantasy.findOne({
                    raw: true,
                    where: {
                        [Op.and]: [{
                            userId: userId
                        }, {
                            eventId: eventId
                        }]
                    }
                });

                await PlayerFantasy.update({
                    money: auctioner.money + valueMax.value
                }, {
                    where: {
                        [Op.and]: [{
                            userId: userId
                        }, {
                            eventId: eventId
                        }]
                    }
                });

                if (warehouseWinner) {
                    await Warehouse.update({
                        quantity: warehouseWinner.quantity + 1,
                    }, {
                        where: {
                            [Op.and]: [{
                                stickerId: playerId
                            }, {
                                userId: winner.userId
                            }]
                        }
                    });
                } else {
                    await Warehouse.create({
                        quantity: 1,
                        isInLineup: false,
                        userId: winner.userId,
                        eventId: eventId,
                        stickerId: playerId
                    });
                }
            }

            schedule.cancelJob(job);
        });
}

const posterBid = async (req, res) => {
    const userId = req.user.id.id;
    const eventId = req.eventId;
    let { value, marketId} = req.body;
    let { isDirectPurchase = false } = req.body;
    value = parseInt(value);
    if (value == null || marketId == null) {
        return responses.errorDTOResponse(res, 400, 'Debe proporcionar un valor y un marketId');
    }

    const market = await Market.findOne({
        raw: true,
        where: {
            [Op.and]: [{
                eventId: eventId
            }, {
                id: marketId
            }]
        }
    });


    const player = await PlayerFantasy.findOne({
        raw: true,
        where: {
            [Op.and]: [
            {
                userId: userId
            }, {
                eventId: eventId
            }]
        }
    })

    const bidTrue = await Bid.findOne({
        raw: true,
        where: {
            [Op.and]: [{
                userId: userId
            }, {
                marketId: marketId
            }]
        }
    })

    if (bidTrue) {
        return responses.errorDTOResponse(res, 403, 'Ya has ofertado en esta subasta use el metodo PUT')
    }

    if (!player) {
        return responses.errorDTOResponse(res, 404, 'No estas participando en ningun evento')
    }
    if (!market) {
        return responses.errorDTOResponse(res, 404, 'No existe esta subasta')
    }
    if (player.money < value) {
        return responses.errorDTOResponse(res, 403, 'No tienes suficiente dinero')
    }
    if (market.isFinished) {
        return responses.errorDTOResponse(res, 403, 'Esta subasta ya ha finalizado')
    }
    if (value < market.initialPurchaseValue) {
        return responses.errorDTOResponse(res, 403, 'El valor de la oferta debe ser mayor al valor inicial')
    }
    if (market.userId == userId) {
        return responses.errorDTOResponse(res, 403, 'No puedes ofertar en tu propia subasta')
    }
    
    if (isDirectPurchase) {
        if (value != market.immediatePurchaseValue) {
            return responses.errorDTOResponse(res, 403, 'El valor de la oferta debe ser igual al valor de compra directa')
        } else {
            const warehouse = await Warehouse.findOne({
                raw: true,
                where: {
                    [Op.and]: [{
                        stickerId: market.stickerId
                    }, {
                        eventId: eventId
                    },{
                        userId: userId
                    }]
                }
            });
            if (!warehouse) {
                await Warehouse.create({
                    quantity: 1,
                    stickerId: market.stickerId,
                    userId: userId,
                    eventId: eventId
                });
            } else {
                await warehouse.update({
                    quantity: warehouse.quantity + 1
                });
            }
            await PlayerFantasy.update({
                money: player.money - value
            }, {
                where: {
                    [Op.and]: [
                    {
                        userId: userId
                    }, {
                        eventId: eventId
                    }]
                }
            });
            await Market.update({
                isFinished: true
            }, {
                where: {
                    [Op.and]: [{
                        eventId: eventId
                    }, {
                        id: marketId
                    }]
                }
            });

            return responses.singleDTOResponse(res, 200, 'Compra realizada con exito', market);

        }
    } else {
        const bid = await Bid.create({
            value: value,
            userId: userId,
            marketId: marketId,
            isDirectPurchase: isDirectPurchase
        });

        await PlayerFantasy.update({
            money: player.money - value
        }, {
            where: {
                [Op.and]: [
                {
                    userId: userId
                }, {
                    eventId: eventId
                }]
            }
        });
        await Market.update({
            initialPurchaseValue: market.initialPurchaseValue + value,
        }, {
            where: {
                [Op.and]: [{
                    eventId: eventId
                }, {
                    id: marketId
                }]
            }
        });
        return responses.singleDTOResponse(res, 200, 'Oferta realizada con exito', bid);
    }
}

module.exports = {
    poster, posterBid
}