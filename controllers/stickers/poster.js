const csv = require('csvtojson');

const responses = require('../../utils/responses/responses');
const { createSticker } = require('./uploadStickers');

const headers = ['nCamisa', 'playerName', 'playerAlias', 'height', 'weight', 'position', 'teamId', 'responsable', 'externalId'];

const postMassive = async (req, res) => {
  const csvParser = csv({
    trim: true,
    delimiter: [',', ';', '|', '$', '\t'],
    noheader: false,
    headers
  });

  const stickersFromCSV = await csvParser.fromFile(req.file.path);

  try {
    await Promise.all(stickersFromCSV.map(async (sticker) => {
      await createSticker({
        playerName: sticker.playerAlias,
        country: null,
        position: sticker.position,
        height: sticker.height,
        weight: sticker.weight,
        appearanceRate: 40,
        teamId: +sticker.teamId,
        externalUuid: sticker.externalId,
        jerseyNumber: parseInt(sticker.nCamisa.slice(4)),
        fileName: sticker.nCamisa + '.png'
      });
    }));
  } catch (e) {
    return responses.errorDTOResponse(res, 500, "Error al subir la mrda xP");
  }

  return responses.successDTOResponse(res, 201, 'Stickers creados con exito');
};

const poster = { 
  postMassive 
};

module.exports = poster;
