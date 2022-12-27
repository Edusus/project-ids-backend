const { Op } = require('sequelize');
const { Warehouse, Sticker, team } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const deleter = async (req, res) => {
    try {
        req.playerId = Number.parseInt(req.params.playerId);
        const userId = req.user.id.id;
        const eventId = req.eventId;
        const warehouse = await Warehouse.findOne({
            where: {
                [Op.and]: [{
                    userId: userId
                }, {
                    eventId: eventId
                }, {
                    stickerId: req.playerId
                },  {
                    isInLineup: true
                }]
            }
        });
         if (!warehouse) {
            responses.errorDTOResponse(res, 403, "No tienes a ese jugador en la plantilla");
         } else {
            await warehouse.update({
                isInLineup: false
            });
            responses.successDTOResponse(res, 200, "Jugador retirado de la alineacion con exito")
         }

    } catch (error) {
        responses.errorDTOResponse(res, 400, err.message);
    }
}

module.exports = {
    deleter
}