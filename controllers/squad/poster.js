const { Op } = require('sequelize');
const { Warehouse, Sticker, team } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const poster = async (req, res) => {
    try {
        const userId = req.user.id.id;
        const eventId = req.eventId;
        const { playerId } = req.body;
        
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
        if (!warehouse) {
            responses.errorDTOResponse(res, 404, 'No posees este Sticker')
        } else {
            const isInLineup = warehouse.isInLineup;
            if (isInLineup) {
                responses.errorDTOResponse(res, 403, 'Este sticker ya esta en la alineacion')
            } else {
                const cont = await Warehouse.count({
                    where: {
                        [Op.and]: [{
                            userId: userId
                        }, {
                            eventId: eventId
                        }, {
                            isInLineup: true
                        }]
                    }
                })
                if (cont >= 11) {
                    responses.errorDTOResponse(res, 403, 'Ya tienes 11 stickers en la alineacion')
                } else {
                    const updatedWarehouse = await Warehouse.update({
                        isInLineup: true
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
                    responses.successDTOResponse(res, 200, 'Sticker agregado a la alineacion')
                }  
            }
        }
    } catch (error) {
        console.error(error);
        responses.errorDTOResponse(res, 403, err.message);
    }
}

module.exports = {
    poster
};