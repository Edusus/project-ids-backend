const { Market, Warehouse, Bid, PlayerFantasy, Op } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const bidUpdate = async (req, res) => {
    const userId = req.user.id.id;
    const eventId = req.eventId;
    const bidId  = req.params.bidId;
    let { value, marketId, isDirectPurchase = false } = req.body;
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
    const bid = await Bid.findOne({
        raw: true,
        where: {
            [Op.and]: [{
                userId: userId
            },{
                marketId: marketId
            }, {
                id: bidId
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

    if (!bid) {
        return responses.errorDTOResponse(res, 400, 'No existe esta oferta');
    }

    if (!player) {
        return responses.errorDTOResponse(res, 400, 'No estas participando en este evento');
    }
    if (!market) {
        return responses.errorDTOResponse(res, 400, 'No existe esta subasta');
    }
    if (player.money < value) {
        return responses.errorDTOResponse(res, 400, 'No tienes suficiente dinero');
    }
    if (market.isFinished) {
        return responses.errorDTOResponse(res, 400, 'La subasta ya ha finalizado');
    }
    if (bid.value > value) {
        return responses.errorDTOResponse(res, 400, 'El valor de la oferta debe ser mayor al valor inicial');
    }
    if (market.userId == userId) {
        return responses.errorDTOResponse(res, 400, 'No puedes ofertar en tu propia subasta');
    }
    if (market.directPurchase == value && isDirectPurchase) {
        const warehouse = await Warehouse.findOne({
            raw: true,
            where: {
                [Op.and]: [{
                    stickerId: market.stickerId
                }, {
                    eventId: eventId
                }, {
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
                [Op.and]: [{
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
                id: marketId
            }
        });

        return responses.singleDTOResponse(res, 200, 'Compra realizada con exito');
    } else {
        if (bid.value + value > market.initialValue ) {
            console.log(bid.value, value, market.initialValue)
            await Bid.update({
                value: bid.value + value
            }, {
                where: {
                    id: bidId
                }
            });

            await PlayerFantasy.update({
                money: player.money - value
            }, {
                where: {
                    [Op.and]: [{
                        userId: userId
                    }, {
                        eventId: eventId
                    }]
                }
            });

            await Market.update({
                initialValue: market.initialValue + (bid.value + value)
            }, {
                where: {
                    id: marketId
                }
            });

            return responses.singleDTOResponse(res, 200, 'Oferta realizada con exito');
        } else {
            return responses.errorDTOResponse(res, 400, 'El valor de la oferta debe ser mayor al valor inicial');
        }

    }

}

module.exports = {
    bidUpdate
};
