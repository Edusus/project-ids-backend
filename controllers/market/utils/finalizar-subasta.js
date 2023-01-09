const { Market, Warehouse, Bid, PlayerFantasy, Op, User } = require('../../../databases/db');

const getPlayerInWarehouseOfUser = async (stickerId, userId) => {
    return await Warehouse.findOne({ 
        where: {
            [Op.and]: [
                { stickerId },
                { userId }
            ]
        },
    });
}

const givePlayerToUser = async (market, user) => {
    const sticker = await market.getSticker();
    const team = await sticker.getTeam();
    const { id: eventId } = await team.getEvent({ raw: true });
    const { id: userId } = user.dataValues;
    const { id: stickerId } = sticker.dataValues;

    const playerInWarehouse = await getPlayerInWarehouseOfUser(stickerId, userId);
    if (playerInWarehouse) {
        const { quantity } = playerInWarehouse.dataValues;
        return await playerInWarehouse.update({ quantity: quantity + 1 });
    }

    await Warehouse.create({
        quantity: 1,
        isInLineup: false,
        userId,
        eventId,
        stickerId
    });
}

const returnPlayerToAuctioneer = async (market) => {
    const userAuctioneer = await User.findByPk(market.userId);
    await givePlayerToUser(market, userAuctioneer);
}

const giveRewardPlayerToBidWinner = async (market, bidWinner) => {
    // Obtener el usuario del ganador
    const userWinner = await User.findByPk(bidWinner.userId);
    await givePlayerToUser(market, userWinner);
}

const returnMoneyToBidLossers = async (market, bidsItems) => {
    const sticker = await market.getSticker();
    const team = await sticker.getTeam();
    const { id: eventId } = await team.getEvent({ raw: true });
    // Le devuelve el dinero a los perdedores UwU
    for (let i = 0; i < bidsItems.length; i++) {
    const { value: bidValue, userId: bidUserId } = bidsItems[i].dataValues;
    const playerFantasy = await PlayerFantasy.findOne({
        where: {
            [Op.and]: [{ userId: bidUserId }, { eventId }]
        }
    });

    await playerFantasy.update({ money: playerFantasy.money + bidValue })
    }
}

const giveMoneyToAuctioner = async (market, bidWinner) => {
    const sticker = await market.getSticker();
    const team = await sticker.getTeam();
    const { id: eventId } = await team.getEvent({ raw: true });
    // Le da el dinero al creador de la subasta
    const auctioner = await PlayerFantasy.findOne({
        where: {
            [Op.and]: [
            {
                userId: market.dataValues.userId
            },
            {
                eventId
            }
            ]
        }
    });
    await auctioner.update({
        money: auctioner.dataValues.money + bidWinner.dataValues.value
    });
}

const finishAuction = async (marketId) => {
    const market = await Market.findByPk(marketId);
    await market.update({ isFinished: true });
    //const { stickerId, userId } = JSON.parse(JSON.stringify(market));

    const bids = await Bid.findAll({
        where: {
            [Op.and]: [{ marketId: market.dataValues.id }]
        },
        order: [['value', 'DESC']]
    });

    if (bids.length <= 0) {
        // Devuelve jugador al subastador, por que nadie le paro bolas
        await returnPlayerToAuctioneer(market);
    } else {
        // Obtener el ganador, que es el primero por que busco el arreglo ordenado
        const bidWinner = bids.shift();
        // Dar recompensa al ganador
        await giveRewardPlayerToBidWinner(market, bidWinner);
        // Le devuelve el dinero a los perdedores UwU
        await returnMoneyToBidLossers(market, bids);
        // Le da el dinero al ganador de la subasta
        await giveMoneyToAuctioner(market, bidWinner);
    }
}

module.exports = {
    finishAuction
}
