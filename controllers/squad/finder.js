const { Op } = require('sequelize');
const { Warehouse, Sticker, Team } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const find = async (req, res) => {
    try {
        const userId = req.user.id.id;
        const eventId = req.eventId;

        let existe = await Warehouse.findOne({
            where: {
                eventId: eventId
            }
        });

        if (!existe) {
           return responses.errorDTOResponse(res, 403, 'Evento no encontrado');
        }


        const lineup = await Warehouse.findAll({
            where: {
                userId: userId,
                eventId: eventId,
                isInLineup: true
              },
            include: {
                model: Sticker,
                attributes: ['id', 'playerName', 'position', 'img', 'createdAt', 'updatedAt'],
                include: {
                    model: Team,
                    attributes: ['id', 'name', 'badge']
                }
            }
        })

        const warehouses = JSON.parse(JSON.stringify(lineup));
        const items = [];
        for (let i = 0; i < warehouses.length; i++) {
            items.push(warehouses[i].sticker);
        }

        responses.singleDTOResponse(res, 200, 'Alineacion recuperado con exito', items)
    } catch (error) {
        console.error(error);
        responses.errorDTOResponse(res, 400, err.message);
    }
}


module.exports = {
    find
};