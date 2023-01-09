const schedule = require('node-schedule');
const { Market, Warehouse, Bid, PlayerFantasy, Op, User } = require('../../databases/db');
const market = require('../../models/market');
const responses = require('../../utils/responses/responses');
const { finishAuction } = require('./utils/finalizar-subasta');

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

class JobManager {
  jobList = {};

  static getJobByMarketId(marketId) {
    return this.jobList[marketId];
  }

  static addJob(marketId, job) {
    this.jobList = { ...this.jobList, [marketId]: job };
  }
}

const poster = async (req, res) => {
    const userId = req.user.id.id;
    const eventId = req.eventId;
    const timeNow = new Date(Date.now());
    const endTime = new Date(timeNow.getTime() + 600000 / 3);
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

    if (warehouse.isInLineup && warehouse.quantity <= 1) {
        return responses.errorDTOResponse(res, 403, 'Este sticker ya esta en la alineacion')
    }

    if (initialValue == null || directPurchase == null || playerId == null) {
        return responses.errorDTOResponse(res, 400, 'Debe proporcionar un valor inicial, un valor de compra directa y un playerId');
    }

    if (warehouse.quantity <= 0) {
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

    try {
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
    
        const job = schedule.scheduleJob(endTime, async () => {
            await finishAuction(market.dataValues.id);
        });
    
        JobManager.addJob(market.dataValues.id, job);
    
        return responses.singleDTOResponse(res, 200, 'Subasta creada con exito', market);
    } catch (e) {
        return responses.errorDTOResponse(res, 500, e.message);
    }
}

const posterBid = async (req, res) => {
    const userId = req.user.id.id;
    const eventId = req.eventId;
    let { value, marketId} = req.body;
    let isDirectPurchase = !!req.body?.isDirectPurchase;
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
    
    console.log('IS DIRECT PURCHARSE???', isDirectPurchase);
    if (isDirectPurchase) {
        if (value != market.immediatePurchaseValue) {
            return responses.errorDTOResponse(res, 403, 'El valor de la oferta debe ser igual al valor de compra directa')
        } else {
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

            const job = JobManager.getJobByMarketId(market.id);
            await finishAuction(market.id);
            schedule.cancelJob(job);

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