const { Op } = require('sequelize');
const { Warehouse, Sticker, team } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const find = async (req, res) => {
  const userId = req.user.id.id;
  const eventId = req.params.eventId
  const warehouses = await Warehouse.findAndCountAll({
    where: {
      userId,
      eventId
    }
  });
  const { count, rows } = warehouses;

  let [stickers, teams, items] = [[], [], []];
  const itemsLength = rows.length;
  for (let i = 0; i < itemsLength; i++) {
    stickers.push(await rows[i].getSticker({
      attributes: ['id', 'playerName', 'position', 'img', 'createdAt', 'updatedAt', 'teamId']
    }));

    teams.push(await stickers[i].getTeam({
      attributes: ['id', 'name', 'badge']
    }));

    let item = {
      id: stickers[i].id,
      playerName: stickers[i].playerName,
      position: stickers[i].position,
      img: stickers[i].img,
      createdAt: stickers[i].createdAt,
      updatedAt: stickers[i].updatedAt,
      team: {
        id: teams[i].id,
        name: teams[i].name,
        badge: teams[i].badge
      }
    }
    items.push(item);
  }

  responses.paginatedDTOsResponse(res, 200, 'Almacen recuperado con exito', items, count, 0, 100);
}

const finder = {
  find
}

module.exports = finder;

