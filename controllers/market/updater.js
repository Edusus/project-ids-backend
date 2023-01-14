const { Market, Warehouse, Bid, PlayerFantasy, Op } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const { finishAuction } = require('./utils/finalizar-subasta');

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

    const newValue = bid.value + value;


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
    if (bid.value > newValue) {
        return responses.errorDTOResponse(res, 400, 'El valor de la oferta debe ser mayor al valor inicial');
    }
    if (value >= market.immediatePurchaseValue-1) {
        return responses.errorDTOResponse(res, 403, 'El valor de la oferta puede ser como maximo ' + (market.immediatePurchaseValue-1) + ' si deseas superarlo, obta por una compra directa.')
    }
    if (market.userId == userId) {
        return responses.errorDTOResponse(res, 400, 'No puedes ofertar en tu propia subasta');
    }

    if (isDirectPurchase) {
            const directValue = market.immediatePurchaseValue;
             if (player.money < directValue) {
                return responses.errorDTOResponse(res, 400, 'No tienes suficiente dinero para comprar directamente');
            }
            await PlayerFantasy.update({
                money: player.money - value
            }, {
                where: {
                    [Op.and]: [{ userId }, { eventId }]
                }
            });

            await Bid.update({
                value: market.immediatePurchaseValue
            }, {
                where: { id: bidId }
            });

            await finishAuction(market.id);
            return responses.singleDTOResponse(res, 200, 'Compra realizada con exito');
        
    } else {
        if (newValue > market.initialPurchaseValue ) {
            await Bid.update({
                value: newValue
            }, {
                where: { id: bidId }
            });

            await PlayerFantasy.update({
                money: player.money - value
            }, {
                where: {
                    [Op.and]: [{ userId }, { eventId }]
                }
            });

            await Market.update({
                initialPurchaseValue: newValue
            }, { where: { id: marketId } });

            return responses.singleDTOResponse(res, 200, 'Oferta realizada con exito');
        } else {
            return responses.errorDTOResponse(res, 400, 'El valor de la oferta debe ser mayor al valor inicial');
        }

    }

}

module.exports = {
    bidUpdate
};
